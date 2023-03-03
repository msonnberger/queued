import { getMe } from '$lib/api/spotify';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { session } = await parent();

	if (!session) {
		throw redirect(303, '/queue/new/login');
	}

	const user_profile = await getMe({ headers: { Authorization: `Bearer ${session.provider_token}` } });

	return {
		user_has_premium: user_profile.product === 'premium'
	};
}) satisfies PageLoad;
