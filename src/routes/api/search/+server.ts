import { json } from '@sveltejs/kit';

import { search } from '$lib/api/spotify';

export async function GET({ url, fetch }) {
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
			}
		}
	);

	return json(result.tracks?.items);
}
