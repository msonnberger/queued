import postgres from 'pg';

import { db } from '$lib/server/db/db.js';
import { waitlist } from '$lib/server/db/schema.js';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		try {
			await db.insert(waitlist).values({ email });
			return { success: true };
		} catch (e) {
			if (e instanceof postgres.DatabaseError && e.code === '23505') {
				return { success: false, reason: 'duplicate' };
			}

			return { success: false };
		}
	}
};
