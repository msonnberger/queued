export async function load({ cookies, locals, fetch, parent }) {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', crypto.randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	const session = await locals.get_session();
	let spotify_access_token: string | undefined;

	if (session?.provider_token) {
		spotify_access_token = session.provider_token;
	} else if (session) {
		const { spotify_refresh_token } = await parent();

		const new_token_res = await fetch('/api/spotify-access-token', {
			method: 'POST',
			body: JSON.stringify({ refresh_token: spotify_refresh_token })
		});

		spotify_access_token = await new_token_res.text();
	}

	return {
		voter_id: cookies.get('voter-id') as string,
		spotify_access_token
	};
}
