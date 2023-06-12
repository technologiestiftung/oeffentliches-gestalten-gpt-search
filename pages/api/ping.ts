import type { NextRequest } from "next/server";
import { ipRateLimit } from "../../lib/ip-rate-limit";
import { Cookies } from "react-cookie";
import { AuthError } from "../../lib/errors";
export const config = {
	runtime: "edge",
};

export default async function handler(req: NextRequest) {
	const res = await ipRateLimit(req);

	// If the status is not 200 then it has been rate limited.
	if (res.status !== 200) return res;

	res.headers.set("content-type", "application/json");

	return new Response(
		JSON.stringify({
			success: true,
			tokenPayload: req.headers.get("X-CSRF-Token"),
		}),
		{
			status: 200,
			headers: res.headers,
		}
	);
}
