import { EnvError } from "./errors";

// frontend
const NEXT_PUBLIC_SUPABASE_ANON_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const NEXT_PUBLIC_HANDBUCH_URL =
	process.env.NEXT_PUBLIC_HANDBUCH_URL ??
	"https://www.oeffentliches-gestalten.de";
// backend
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const OPENAI_KEY = process.env.OPENAI_KEY ?? "";
const MDX_DOCS_PATH = process.env.MDX_DOCS_PATH ?? "";
const UPSTASH_REST_API_DOMAIN = process.env.UPSTASH_REST_API_DOMAIN ?? "";
const UPSTASH_REST_API_TOKEN = process.env.UPSTASH_REST_API_TOKEN ?? "";
// no need to test these since they have defaults
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo";
const NODE_ENV = process.env.NODE_ENV ?? "development";

if (NEXT_PUBLIC_SUPABASE_ANON_KEY.length === 0) {
	throw new EnvError("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}
if (NEXT_PUBLIC_SUPABASE_URL.length === 0) {
	throw new EnvError("NEXT_PUBLIC_SUPABASE_URL");
}
if (SUPABASE_SERVICE_ROLE_KEY.length === 0) {
	throw new EnvError("SUPABASE_SERVICE_ROLE_KEY");
}
if (JWT_SECRET.length === 0) {
	throw new EnvError("JWT_SECRET");
}
if (OPENAI_KEY.length === 0) {
	throw new EnvError("OPENAI_KEY");
}
if (MDX_DOCS_PATH.length === 0) {
	throw new EnvError("MDX_DOCS_PATH");
}
if (UPSTASH_REST_API_DOMAIN.length === 0) {
	throw new EnvError("UPSTASH_REST_API_DOMAIN");
}
if (UPSTASH_REST_API_TOKEN.length === 0) {
	throw new EnvError("UPSTASH_REST_API_TOKEN");
}

export {
	NODE_ENV,
	NEXT_PUBLIC_SUPABASE_ANON_KEY,
	NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_HANDBUCH_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	JWT_SECRET,
	OPENAI_KEY,
	MDX_DOCS_PATH,
	UPSTASH_REST_API_DOMAIN,
	UPSTASH_REST_API_TOKEN,
	OPENAI_MODEL,
};
