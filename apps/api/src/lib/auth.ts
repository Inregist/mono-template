import { type createDb, table } from "@repo/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, openAPI } from "better-auth/plugins";
import type { Env } from "../env.types";

export const createAuth = (
	env: Env["Bindings"],
	db: ReturnType<typeof createDb>,
) => {
	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: table,
			usePlural: true,
		}),
		advanced: {
			database: {
				generateId: "uuid",
			},
		},
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		// logger: { level: "debug" },
		plugins: [openAPI(), anonymous()],
		socialProviders: {
			line: {
				clientId: env.LINE_CLIENT_ID,
				clientSecret: env.LINE_CLIENT_SECRET,
				mapProfileToUser(profile) {
					profile.email = profile.email || `${profile.sub}@authline.com`;
					return profile;
				},
			},
		},
	});
};
