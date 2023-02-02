import { randomUUID } from 'crypto';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}
}) satisfies PageServerLoad;
