import type { createDb } from "@repo/database";
import type { Env as HonoEnv } from "hono";
import type { createAuth } from "./lib/auth";

export interface Env extends HonoEnv {
  Bindings: {
    NODE_ENV: "local" | "development" | "production";
    CORS_ORIGIN: string;
    DATABASE_URL: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    LINE_CLIENT_ID: string;
    LINE_CLIENT_SECRET: string;
  };
  Variables: {
    DB: ReturnType<typeof createDb>;
    AUTH: ReturnType<typeof createAuth>;
  };
}
