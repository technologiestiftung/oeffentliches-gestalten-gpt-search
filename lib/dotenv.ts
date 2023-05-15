import { EnvError } from "./errors";

// frontend
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_HANDBUCH_URL =
	process.env.NEXT_PUBLIC_HANDBUCH_URL ??
	"https://www.oeffentliches-gestalten.de";
// backend
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const OPENAI_KEY = process.env.OPENAI_KEY;
const MDX_DOCS_PATH = process.env.MDX_DOCS_PATH;
const UPSTASH_REST_API_DOMAIN = process.env.UPSTASH_REST_API_DOMAIN;
const UPSTASH_REST_API_TOKEN = process.env.UPSTASH_REST_API_TOKEN;
// no need to test these since they have defaults
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-3.5-turbo";
const NODE_ENV = process.env.NODE_ENV ?? "development";

export function getEnvs() {
	if (NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
		throw new EnvError("NEXT_PUBLIC_SUPABASE_ANON_KEY");
	}
	if (NEXT_PUBLIC_SUPABASE_URL === undefined) {
		throw new EnvError("NEXT_PUBLIC_SUPABASE_URL");
	}
	if (SUPABASE_SERVICE_ROLE_KEY === undefined) {
		throw new EnvError("SUPABASE_SERVICE_ROLE_KEY");
	}
	if (JWT_SECRET === undefined) {
		throw new EnvError("JWT_SECRET");
	}
	if (OPENAI_KEY === undefined) {
		throw new EnvError("OPENAI_KEY");
	}
	if (MDX_DOCS_PATH === undefined) {
		throw new EnvError("MDX_DOCS_PATH");
	}
	if (UPSTASH_REST_API_DOMAIN === undefined) {
		throw new EnvError("UPSTASH_REST_API_DOMAIN");
	}
	if (UPSTASH_REST_API_TOKEN === undefined) {
		throw new EnvError("UPSTASH_REST_API_TOKEN");
	}

	return {
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
}
