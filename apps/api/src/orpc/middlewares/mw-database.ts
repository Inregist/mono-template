import { orpc } from "..";

export const mwDatabase = orpc.middleware(async ({ context, next }) => {
  return next({
    context: { db: context.honoVar.DB },
  });
});
