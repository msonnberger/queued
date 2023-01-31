import { getMe } from '$lib/api/spotify';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session } = await getSupabase(event);

	if (!session) {
		throw redirect(303, '/queue/new/login');
	}

	const user_profile = await getMe({ headers: { Authorization: `Bearer ${session.provider_token}` } });

	return {
		user_has_premium: user_profile.product === 'premium'
	};
}) satisfies PageLoad;