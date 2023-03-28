export async function load({ locals, depends, cookies }) {
	depends('supabase:auth');
	const session = await locals.get_session();

	if (session?.provider_refresh_token) {
		cookies.set('spotify-refresh-token', session.provider_refresh_token, { path: '/' });
	}

	return {
		session,
		spotify_refresh_token: cookies.get('spotify-refresh-token')
	};
}
