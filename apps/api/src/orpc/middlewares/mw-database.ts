import { createDb } from "@repo/database";
import { orpc } from "..";

export const mwDatabase = orpc.middleware(async ({ context, next }) => {
	const db = createDb(context.honoEnv.DATABASE_URL);

	return next({
		context: { db },
	});
});
