import type { Context } from "hono";
import type { Env } from "../env.types";

export const evaluateCors = (origin: string, ctx: Context<Env>) => {
	if (ctx.env.CORS_ORIGIN === "*") {
		return origin;
	}

	const allowedOrigins = ctx.env.CORS_ORIGIN.split(",").map((o) => o.trim());
	if (allowedOrigins.includes(origin)) {
		return origin;
	}

	return null;
};
