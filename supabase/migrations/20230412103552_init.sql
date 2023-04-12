create extension if not exists "vector" with schema "extensions";

create sequence "public"."nods_page_id_seq";
create sequence "public"."nods_page_section_id_seq";

create table "public"."nods_page" (
    "id" bigint not null default nextval('nods_page_id_seq'::regclass),
    "parent_page_id" bigint,
    "path" text not null,
    "checksum" text,
    "meta" jsonb,
    "type" text,
    "source" text
);


alter table "public"."nods_page" enable row level security;

create table "public"."nods_page_section" (
    "id" bigint not null default nextval('nods_page_section_id_seq'::regclass),
    "page_id" bigint not null,
    "content" text,
    "token_count" integer,
    "embedding" vector(1536),
    "slug" text,
    "heading" text
);


alter table "public"."nods_page_section" enable row level security;

alter sequence "public"."nods_page_id_seq" owned by "public"."nods_page"."id";

alter sequence "public"."nods_page_section_id_seq" owned by "public"."nods_page_section"."id";

CREATE UNIQUE INDEX nods_page_path_key ON public.nods_page USING btree (path);

CREATE UNIQUE INDEX nods_page_pkey ON public.nods_page USING btree (id);

CREATE UNIQUE INDEX nods_page_section_pkey ON public.nods_page_section USING btree (id);

alter table "public"."nods_page" add constraint "nods_page_pkey" PRIMARY KEY using index "nods_page_pkey";

alter table "public"."nods_page_section" add constraint "nods_page_section_pkey" PRIMARY KEY using index "nods_page_section_pkey";

alter table "public"."nods_page" add constraint "nods_page_parent_page_id_fkey" FOREIGN KEY (parent_page_id) REFERENCES nods_page(id) not valid;

alter table "public"."nods_page" validate constraint "nods_page_parent_page_id_fkey";

alter table "public"."nods_page" add constraint "nods_page_path_key" UNIQUE using index "nods_page_path_key";

alter table "public"."nods_page_section" add constraint "nods_page_section_page_id_fkey" FOREIGN KEY (page_id) REFERENCES nods_page(id) ON DELETE CASCADE not valid;

alter table "public"."nods_page_section" validate constraint "nods_page_section_page_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_page_parents(page_id bigint)
 RETURNS TABLE(id bigint, parent_page_id bigint, path text, meta jsonb)
 LANGUAGE sql
AS $function$
  with recursive chain as (
    select *
    from nods_page 
    where id = page_id

    union all

    select child.*
      from nods_page as child
      join chain on chain.parent_page_id = child.id 
  )
  select id, parent_page_id, path, meta
  from chain;
$function$
;

CREATE OR REPLACE FUNCTION public.match_page_sections(embedding vector, match_threshold double precision, match_count integer, min_content_length integer)
 RETURNS TABLE(id bigint, page_id bigint, slug text, heading text, content text, similarity double precision)
 LANGUAGE plpgsql
AS $function$
#variable_conflict use_variable
begin
  return query
  select
    nods_page_section.id,
    nods_page_section.page_id,
    nods_page_section.slug,
    nods_page_section.heading,
    nods_page_section.content,
    (nods_page_section.embedding <#> embedding) * -1 as similarity
  from nods_page_section

  -- We only care about sections that have a useful amount of content
  where length(nods_page_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (nods_page_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by nods_page_section.embedding <#> embedding
  
  limit match_count;
end;
$function$
;




