//  based on
// https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { jwtVerify } from "jose";
import { AuthError } from "./errors";

export async function verifyCookie(token: string) {
	if (!token) throw new AuthError("Missing token");
	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecretKey())
		);
		return verified.payload;
	} catch (err) {
		throw new AuthError("Your token is not valid");
	}
}

export function getJwtSecretKey(): string {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is required");
	}
	return process.env.JWT_SECRET;
}
