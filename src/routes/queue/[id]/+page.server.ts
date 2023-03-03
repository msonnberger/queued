import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', crypto.randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	return {
		voter_id: cookies.get('voter-id') as string
	};
}) satisfies PageServerLoad;
