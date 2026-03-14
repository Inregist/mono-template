import { ORPCError } from "@orpc/client";
import { orpc } from "..";

export const mwAuth = orpc.middleware(async ({ context, next }) => {
  const session = await context.honoVar.AUTH.api.getSession({
    headers: context.headers,
  });

  if (!session?.session || !session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: session.session,
      user: session.user,
    },
  });
});
