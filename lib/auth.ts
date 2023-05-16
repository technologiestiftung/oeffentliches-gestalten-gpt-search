//  based on
// https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { jwtVerify } from "jose";
import { AuthError, EnvError } from "./errors";
const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyCookie(token: string) {
	if (!JWT_SECRET) throw new EnvError("JWT_SECRET");
	if (!token) throw new AuthError("Missing token");
	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(JWT_SECRET)
		);
		return verified.payload;
	} catch (err) {
		throw new AuthError("Your token is not valid");
	}
}
