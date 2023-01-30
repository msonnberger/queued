import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.session) {
		throw redirect(303, '/queue/new');
	}
}) satisfies PageServerLoad;
