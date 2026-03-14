import { os } from "@orpc/server";
import z from "zod";
import type { Env } from "../env.types";

export const orpc = os
  .$context<{
    headers: Headers;
    honoEnv: Env["Bindings"];
    honoVar: Env["Variables"];
  }>()
  .$input(z.void());
