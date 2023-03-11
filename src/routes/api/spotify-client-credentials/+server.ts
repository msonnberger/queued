import { text } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

export const GET = (async ({ fetch }) => {
	const token_res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
		},
		body: 'grant_type=client_credentials'
	});

	const { access_token } = await token_res.json();

	return text(access_token);
}) satisfies RequestHandler;
