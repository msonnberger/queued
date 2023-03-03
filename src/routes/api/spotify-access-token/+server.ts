import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request, fetch }) => {
	const { refresh_token } = await request.json();
	const token_res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token
		}).toString()
	});

	const { access_token } = await token_res.json();

	if (!access_token) {
		throw error(500, 'Could not retrieve access token.');
	}

	return text(access_token);
}) satisfies RequestHandler;