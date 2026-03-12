import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env.types";
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
  .use("/rpc/*", async (c, next) => {
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: "/rpc",
      /** Provide context as needed */
      context: {
        honoEnv: c.env,
        honoVar: c.var,
      },
    });

    if (matched) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

export { router };
export default app;
