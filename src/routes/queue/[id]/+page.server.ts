export async function load({ cookies, locals }) {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', crypto.randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	const { access_token } = await locals.get_spotify_tokens();

	return {
		access_token,
		voter_id: cookies.get('voter-id') as string
	};
}
