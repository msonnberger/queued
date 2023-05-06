import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';

import { getTracks } from '$lib/api/spotify';

export const config: Config = {
	// runtime: 'edge',
	// regions: 'all'
};

export async function GET({ url, fetch, setHeaders }) {
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
			},
			fetch: async (input, init) => {
				const res = await fetch(input, init);
				const cache_control = res.headers.get('cache-control');

				if (cache_control !== null) {
					setHeaders({ 'cache-control': cache_control });
				}

				return res;
			}
		}
	);

	return json(tracks_res.tracks);
}
