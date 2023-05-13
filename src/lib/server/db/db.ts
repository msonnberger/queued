import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'pg';

import { DB_CONNECTION_STRING } from '$env/static/private';

export const connection_pool = new postgres.Pool({
	connectionString: DB_CONNECTION_STRING
});

export const db = drizzle(connection_pool);
