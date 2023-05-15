import { EnvError } from "./errors";

const UPSTASH_REST_API_DOMAIN = process.env.UPSTASH_REST_API_DOMAIN;
const UPSTASH_REST_API_TOKEN = process.env.UPSTASH_REST_API_TOKEN;

/**
 * Upstash REST and Edge API utils.
 * Note: taken from https://github.com/vercel/examples/tree/main/edge-functions/api-rate-limit
 */
async function upstash({
	url,
	token,
	...init
}: { url: string; token: string } & RequestInit) {
	console.log(`Fetching ${url}`);
	const res = await fetch(url, {
		...init,
		headers: {
			authorization: `Bearer ${token}`,
			...init.headers,
		},
	});

	const data = res.headers.get("Content-Type")!.includes("application/json")
		? await res.json()
		: await res.text();

	if (res.ok) {
		return data;
	} else {
		throw new Error(
			`Upstash failed with (${res.status}): ${
				typeof data === "string" ? data : JSON.stringify(data, null, 2)
			}`
		);
	}
}

export async function upstashRest(
	args: any[],
	options?: { pipeline: boolean }
) {
	if (UPSTASH_REST_API_DOMAIN === undefined)
		throw new EnvError("UPSTASH_REST_API_DOMAIN");
	if (UPSTASH_REST_API_TOKEN === undefined)
		throw new EnvError("UPSTASH_REST_API_TOKEN");
	const domain = UPSTASH_REST_API_DOMAIN;
	const token = UPSTASH_REST_API_TOKEN;

	if (!domain || !token) {
		throw new Error("Missing required Upstash credentials of the REST API");
	}

	return upstash({
		token,
		url: `https://${domain}${options?.pipeline ? "/pipeline" : ""}`,
		method: "POST",
		body: JSON.stringify(args),
	});
}

export async function upstashEdge(args: any[]) {
	if (UPSTASH_REST_API_DOMAIN === undefined)
		throw new EnvError("UPSTASH_REST_API_DOMAIN");
	if (UPSTASH_REST_API_TOKEN === undefined)
		throw new EnvError("UPSTASH_REST_API_TOKEN");
	const domain = UPSTASH_REST_API_DOMAIN;
	const token = UPSTASH_REST_API_TOKEN;

	if (!domain || !token) {
		throw new Error("Missing required Upstash credentials of the Edge API");
	}

	return upstash({ token, url: `https://${domain}/${args.join("/")}` });
}
