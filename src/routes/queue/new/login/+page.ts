import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (session) {
		throw redirect(303, '/queue/new');
	}
}) satisfies PageLoad;
