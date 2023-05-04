import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';

import { getTracks } from '$lib/api/spotify';

export const config: Config = {
	// runtime: 'edge',
	// regions: 'all'
};

export async function GET({ url, fetch }) {
	const track_ids = url.searchParams.get('track_ids');

	if (track_ids === null) {
		return json([]);
	}

	const access_token_res = await fetch('/api/spotify-client-credentials');
	const access_token = await access_token_res.text();

	const tracks_res = await getTracks(
		track_ids,
		{},
		{
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		}
	);

	return json(tracks_res.tracks);
}
