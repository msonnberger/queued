import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';

import { search } from '$lib/api/spotify';

export const config: Config = {
	// 	runtime: 'edge',
	// 	regions: 'all'
};

export async function GET({ url, fetch, setHeaders }) {
	const q = url.searchParams.get('q');

	if (q === null) {
		return json(undefined);
	}

	const access_token_res = await fetch('/api/spotify-client-credentials');
	const access_token = await access_token_res.text();

	const result = await search(
		q,
		'track',
		{ limit: 5, market: 'AT' },
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

	return json(result.tracks?.items);
}
