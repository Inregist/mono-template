import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
	const pool = new Pool({
		connectionString: databaseUrl,
		max: 1,
	});
	return drizzle({ client: pool, schema });
}
