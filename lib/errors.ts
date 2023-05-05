export class ApplicationError extends Error {
	constructor(message: string, public data: Record<string, any> = {}) {
		super(message);
	}
}
export class AuthError extends Error {}

export class UserError extends ApplicationError {}

export class AuthError extends Error {}
