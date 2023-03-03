import { redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session } = await getSupabase(event);

	if (session) {
		throw redirect(303, '/queue/new');
	}
}) satisfies PageLoad;
