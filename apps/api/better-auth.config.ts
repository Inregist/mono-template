import { createDb } from "@repo/database";
import type { Env } from "./src/env.types";
import { createAuth } from "./src/lib/auth";

const db = createDb(process.env.DATABASE_URL || "");

const honoEnv: Env["Bindings"] = {
	...(process.env as Env["Bindings"]),
	DATABASE_URL: process.env.DATABASE_URL || "",
};

export const auth = createAuth(honoEnv, db);
