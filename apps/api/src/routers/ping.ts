import { os } from "@orpc/server";
import z from "zod";

const ping = os.handler(async () => "pong");
const pong = os
  .input(
    z.object({
      message: z.string(),
    })
  )
  .handler(async ({ input }) => `msg: ${input.message}`);

export const pingPongRouter = {
  ping,
  pong,
  nested: { ping, pong },
};
