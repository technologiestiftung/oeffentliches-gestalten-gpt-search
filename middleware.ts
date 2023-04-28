import { NextRequest, NextResponse } from "next/server";
import csrf from "edge-csrf";

// initalize protection function
const csrfProtect = csrf({
	cookie: {
		name: "csrf-handbuch-gpt",
		secure: process.env.NODE_ENV === "production",
	},
});

export async function middleware(req: NextRequest) {
	const response = NextResponse.next();

	// csrf protection
	const csrfError = await csrfProtect(req, response);

	// check result
	if (csrfError) {
		return new NextResponse("invalid csrf token", { status: 403 });
	}

	return response;
}
