import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { auth } from '$lib/server/lucia';

export async function handle({ event, resolve }) {
	event.locals.supabase_admin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
	event.locals.auth = auth.handleRequest(event);
	event.locals.get_spotify_tokens = async () => {
		const session = await event.locals.auth.validate();

		if (!session) {
			return {
				access_token: null,
				refresh_token: null,
				expires_in: null
			};
		}

		const { data, error } = await event.locals.supabase_admin
			.from('spotify_tokens')
			.select()
			.eq('user_id', session.userId)
			.maybeSingle();

		if (error) throw error;

		if (data === null) {
			return {
				access_token: null,
				refresh_token: null,
				expires_in: null
			};
		}

		const { refresh_token } = data;
		let { expires_in, access_token } = data;

		if (expires_in < 60 * 10) {
			const new_token_res = await event.fetch('/api/spotify-access-token', {
				method: 'POST',
				body: JSON.stringify({ refresh_token })
			});

			const { expires_in: new_expires_in, access_token: new_access_token } = (await new_token_res.json()) as {
				access_token: string;
				expires_in: number;
			};

			const { error } = await event.locals.supabase_admin
				.from('spotify_tokens')
				.update({ access_token: new_access_token, expires_in: new_expires_in })
				.eq('user_id', session.userId);

			if (error) throw error;

			access_token = new_access_token;
			expires_in = new_expires_in;
		}

		return { expires_in, access_token, refresh_token };
	};

	return resolve(event);
}
