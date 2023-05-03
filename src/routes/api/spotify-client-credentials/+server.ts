import type { Config } from '@sveltejs/adapter-vercel';
import { text } from '@sveltejs/kit';

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

export const config: Config = {
	// 	runtime: 'edge',
	// 	regions: 'all'
};

export async function GET({ fetch }) {
	const token_res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
		},
		body: 'grant_type=client_credentials'
	});

	const { access_token } = await token_res.json();

	return text(access_token);
}
