import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { createDb } from "@repo/database";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env.types";
import { createAuth } from "./lib/auth";
import { router } from "./routers";
import { evaluateCors } from "./utils/cors";
import { openApiRefPlugin } from "./utils/openapi";

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
  plugins: [
    new CORSPlugin({ exposeHeaders: ["Content-Disposition"] }),
    openApiRefPlugin,
  ],
});

const app = new Hono<Env>()
  .use(cors({ origin: evaluateCors, credentials: true }))
  .use("*", async (c, next) => {
    const db = createDb(c.env.DATABASE_URL);
    c.set("DB", db);

    const auth = createAuth(c.env, db);
    c.set("AUTH", auth);

    await next();
  })
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    return c.get("AUTH").handler(c.req.raw);
  })
  .use("/api/rpc/*", async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: "/api/rpc",
      /** Provide context as needed */
      context: {
        headers: c.req.raw.headers,
        honoEnv: c.env,
        honoVar: c.var,
      },
    });

    if (matched) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

export default app;
