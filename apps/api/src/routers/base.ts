import { orpc } from "../orpc";
import { mwAuth } from "../orpc/middlewares/mw-auth";

export const publicRoute = orpc;
export const protectedRoute = orpc.use(mwAuth);
