//  based on
// https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { jwtVerify } from "jose";
import { AuthError } from "./errors";
import { getEnvs } from "./dotenv";
const { JWT_SECRET } = getEnvs();

export async function verifyCookie(token: string) {
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
