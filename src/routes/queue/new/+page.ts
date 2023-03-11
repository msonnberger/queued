import { redirect } from '@sveltejs/kit';

import { getMe } from '$lib/api/spotify';

export async function load({ parent }) {
	const { session } = await parent();

	if (!session) {
		throw redirect(303, '/queue/new/login');
	}

	const user_profile = await getMe({ headers: { Authorization: `Bearer ${session.provider_token}` } });

	return {
		user_has_premium: user_profile.product === 'premium'
	};
}
