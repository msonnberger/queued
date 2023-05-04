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
			return { access_token: null };
		}

		const { data, error } = await event.locals.supabase_admin
			.from('spotify_tokens')
			.select()
			.eq('user_id', session.userId)
			.maybeSingle();

		if (error) throw error;

		if (data === null) {
			return { access_token: null };
		}

		const { refresh_token } = data;

		const new_token_res = await event.fetch('/api/spotify-access-token', {
			method: 'POST',
			body: JSON.stringify({ refresh_token })
		});

		const { access_token } = (await new_token_res.json()) as { access_token: string };

		if (error) throw error;

		return { access_token };
	};

	return resolve(event);
}
