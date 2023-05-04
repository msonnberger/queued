import { redirect } from '@sveltejs/kit';

import { spotify_auth } from '$lib/server/lucia.js';

export async function GET({ cookies, url }) {
	const [auth_url, state] = await spotify_auth.getAuthorizationUrl();

	cookies.set('spotify_oauth_state', state, {
		path: '/',
		maxAge: 60 * 60
	});

	cookies.set(state, url.searchParams.get('redirect_to') ?? '/', {
		path: '/',
		maxAge: 60 * 60
	});

	throw redirect(303, auth_url.toString());
}
