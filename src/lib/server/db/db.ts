import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'pg';

import { SUPABASE_CONNECTION_STRING } from '$env/static/private';

export const connection_pool = new postgres.Pool({
	connectionString: SUPABASE_CONNECTION_STRING
});

export const db = drizzle(connection_pool);
