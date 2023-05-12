import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db/db';
import { spotify_tokens } from '$lib/server/db/schema';
import { auth } from '$lib/server/lucia';

export async function handle({ event, resolve }) {
	event.locals.auth = auth.handleRequest(event);
	event.locals.get_spotify_tokens = async () => {
		const session = await event.locals.auth.validate();

		if (!session) {
			return { access_token: null };
		}

		const [data] = await db
			.select({ refresh_token: spotify_tokens.refresh_token })
			.from(spotify_tokens)
			.where(eq(spotify_tokens.user_id, session.userId));

		if (data === undefined) {
			return { access_token: null };
		}

		const new_token_res = await event.fetch('/api/spotify-access-token', {
			method: 'POST',
			body: JSON.stringify({ refresh_token: data.refresh_token })
		});

		const { access_token } = (await new_token_res.json()) as { access_token: string };

		return { access_token };
	};

	return resolve(event);
}
