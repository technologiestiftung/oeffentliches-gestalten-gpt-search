// jwt signing tzaken from https://github.com/vercel/examples/blob/main/edge-middleware/jwt-authentication/middleware.ts
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "./lib/auth";
export async function middleware(request: NextRequest) {
	let response = NextResponse.next();
	let cookie = request.cookies.get("csrf");

	if (cookie === undefined) {
		const token = await new SignJWT({})
			.setProtectedHeader({ alg: "HS256" })
			.setJti(uuidv4())
			.setIssuedAt()
			.setExpirationTime("2h")
			.sign(new TextEncoder().encode(getJwtSecretKey()));

		response.cookies.set("csrf", token, {
			httpOnly: false,
			maxAge: 60 * 60 * 2,
		});
		return response;
	}

	return;
}

// import { NextRequest, NextResponse } from "next/server";
// import csrf from "edge-csrf";

// // initalize protection function
// const csrfProtect = csrf({
// 	cookie: {
// 		name: "csrf-handbuch-gpt",
// 		secure: process.env.NODE_ENV === "production",
// 	},
// });

// export const config = {
// 	matcher: "/api/vector-search",
// };

// export async function middleware(req: NextRequest) {
// 	const response = NextResponse.next();

// 	// csrf protection
// 	const csrfError = await csrfProtect(req, response);

// 	// check result
// 	if (csrfError) {
// 		return new NextResponse("invalid csrf token", { status: 403 });
// 	}

// 	return response;
// }
