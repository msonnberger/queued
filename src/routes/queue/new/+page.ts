import { redirect } from '@sveltejs/kit';

import { getMe } from '$lib/api/spotify';

export async function load({ parent, fetch }) {
	const { session, spotify_refresh_token } = await parent();

	if (!session) {
		throw redirect(303, '/queue/new/login');
	}

	const token_res = await fetch('/api/spotify-access-token', {
		method: 'POST',
		body: JSON.stringify({ refresh_token: spotify_refresh_token })
	});

	const spotify_access_token = await token_res.text();
	const user_profile = await getMe({ headers: { Authorization: `Bearer ${spotify_access_token}` } });

	return {
		user_name: session.user.user_metadata.name,
		user_has_premium: user_profile.product === 'premium'
	};
}
