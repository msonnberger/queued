import type { Config } from '@sveltejs/adapter-vercel';
import { error, json } from '@sveltejs/kit';

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

export const config: Config = {
	// 	runtime: 'edge',
	// 	regions: 'all'
};

export async function POST({ request, fetch }) {
	const { refresh_token } = await request.json();
	const token_res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
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

	return json({
		access_token
	});
}
