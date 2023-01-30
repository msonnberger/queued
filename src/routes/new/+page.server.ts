import { getMe } from '$lib/api/spotify';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/new/login');
	}

	const user_profile = await getMe({ headers: { Authorization: `Bearer ${locals.session.provider_token}` } });
	const user_has_premium = user_profile.product === 'premium';

	return {
		user_has_premium
	};
}) satisfies PageServerLoad;
