import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
	if (!_db) {
		const pool = new pg.Pool({
			connectionString: env.DATABASE_URL
		});
		_db = drizzle(pool, { schema });
	}
	return _db;
}

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

// For backwards compatibility — lazy getter
export const db = new Proxy({} as DbInstance, {
	get(_target, prop: string | symbol) {
		return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
	}
}) as DbInstance;
