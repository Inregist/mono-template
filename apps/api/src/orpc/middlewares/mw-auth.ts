import { os } from "@orpc/server";

export const mwAuth = os.middleware(async ({ next }) => {
  console.log("Auth middleware executed");
  return next();
});
