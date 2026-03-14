import { AsyncLocalStorage } from "node:async_hooks";
import { type createDb, table } from "@repo/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import type { ExecutionContext } from "hono";
import type { Env } from "../env.types";

const execCtxStorage = new AsyncLocalStorage<ExecutionContext>();

export const createAuth = (
  env: Env["Bindings"],
  db: ReturnType<typeof createDb>,
) => {
  return betterAuth({
    trustedOrigins: env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: table,
      usePlural: true,
    }),
    advanced: {
      /** https://better-auth.com/docs/reference/options#backgroundtasks */
      backgroundTasks: {
        handler: (p) => execCtxStorage.getStore()?.waitUntil(p),
      },
      database: {
        generateId: "uuid",
      },
    },
    // logger: { level: "debug" },
    plugins: [openAPI(), admin()],
    user: {
      changeEmail: { enabled: true, requireEmailVerification: true },
    },
    emailVerification: {
      sendVerificationEmail: async (data, request) => {
        console.log(
          "Send verification email to:",
          data.user.email,
          `\ndata:`,
          data,
          `\nrequest:`,
          request,
        );

        throw new Error(
          "sendVerificationEmail is not implemented. Please implement sendVerificationEmail in the auth configuration.",
        );
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      requireEmailVerification: false,
    },
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
