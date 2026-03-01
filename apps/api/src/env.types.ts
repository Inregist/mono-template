import type { Env as HonoEnv } from "hono";

export interface Env extends HonoEnv {
  Bindings: {
    CORS_ORIGIN: string;
  };
}
