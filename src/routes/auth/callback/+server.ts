import { error, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db/db.js';
import { spotify_tokens } from '$lib/server/db/schema.js';
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

		await db
			.insert(spotify_tokens)
			.values({ user_id: user.id, refresh_token: tokens.refreshToken })
			.onConflictDoUpdate({ target: spotify_tokens.user_id, set: { refresh_token: tokens.refreshToken } });
	} catch (err) {
		console.error(err);
		throw error(500, 'Something went wrong.');
	}

	const redirect_to = cookies.get(stored_state);

	cookies.delete('spotify_oauth_state', { path: '/' });
	cookies.delete(stored_state, { path: '/' });

	throw redirect(302, redirect_to ?? '/');
}
