import { error, redirect } from '@sveltejs/kit';

import { auth, spotify_auth } from '$lib/server/lucia.js';

export async function GET({ url, cookies, locals }) {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const stored_state = cookies.get('spotify_oauth_state');

	if (!code || !state || state !== stored_state) {
		throw error(400);
	}

	try {
		const { existingUser, providerUser, createUser, tokens } = await spotify_auth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) return existingUser;

			return await createUser({
				name: providerUser.display_name
			});
		};

		const user = await getUser();
		const session = await auth.createSession(user.id);

		locals.auth.setSession(session);

		const { error: err } = await locals.supabase_admin.from('spotify_tokens').upsert({
			user_id: user.id,
			expires_in: tokens.expiresIn,
			access_token: tokens.accessToken,
			refresh_token: tokens.refreshToken
		});

		if (err) throw err;
	} catch (err) {
		console.error(err);
		throw error(500, 'Something went wrong.');
	}

	const redirect_to = cookies.get(stored_state);

	cookies.delete('spotify_oauth_state', { path: '/' });
	cookies.delete(stored_state, { path: '/' });

	throw redirect(302, redirect_to ?? '/');
}
