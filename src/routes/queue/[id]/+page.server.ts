import { error } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
	try {
		if (cookies.get('voter-id') === undefined) {
			cookies.set('voter-id', crypto.randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
		}

		const { access_token } = await locals.get_spotify_tokens();

		return {
			access_token,
			voter_id: cookies.get('voter-id') as string
		};
	} catch (err) {
		throw error(500, err as string);
	}
}
