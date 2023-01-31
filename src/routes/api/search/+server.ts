import type { RequestHandler } from './$types';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { search } from '$lib/api/spotify';
import { json } from '@sveltejs/kit';

export const GET = (async ({ url, fetch }) => {
	const q = url.searchParams.get('q');

	if (q === null) {
		return json(undefined);
	}

	const token_res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
		},
		body: 'grant_type=client_credentials'
	});

	const { access_token } = await token_res.json();

	const result = await search(
		q,
		'track',
		{ limit: 5 },
		{
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		}
	);

	return json(result.tracks?.items);
}) satisfies RequestHandler;
