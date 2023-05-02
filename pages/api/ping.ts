import type { NextRequest } from "next/server";
import { ipRateLimit } from "../../lib/ip-rate-limit";
import { Cookies } from "react-cookie";
import { AuthError, verifyCookie } from "../../lib/auth";
export const config = {
	runtime: "edge",
};

export default async function handler(req: NextRequest) {
	const res = await ipRateLimit(req);

	// If the status is not 200 then it has been rate limited.
	if (res.status !== 200) return res;
	const cookies = new Cookies(req.headers.get("cookie") ?? "");
	console.log(cookies.get("csrf"));
	const token = cookies.get("csrf");
	let payload: unknown;
	try {
		payload = await verifyCookie(token);
		console.log(payload);
	} catch (error) {
		if (error instanceof AuthError) {
			console.log(error);
			return new Response(
				JSON.stringify({ success: false, error: error.message }),
				{
					status: 401,
					headers: res.headers,
				}
			);
		} else {
			return new Response(
				JSON.stringify({ success: false, error: "Unknown error" }),
				{
					status: 500,
					headers: res.headers,
				}
			);
		}
	}
	res.headers.set("content-type", "application/json");

	return new Response(
		JSON.stringify({ success: true, tokenPayload: payload }),
		{
			status: 200,
			headers: res.headers,
		}
	);
}
