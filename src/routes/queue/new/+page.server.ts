import { error, redirect } from '@sveltejs/kit';

import { getMe } from '$lib/api/spotify';
import { db } from '$lib/server/db/db.js';
import { queues } from '$lib/server/db/schema.js';

export async function load({ locals }) {
	const { session, user } = await locals.auth.validateUser();

	if (!session) {
		throw redirect(303, '/queue/new/login');
	}

	const { access_token } = await locals.get_spotify_tokens();
	const user_profile = await getMe({ headers: { Authorization: `Bearer ${access_token}` } });

	return {
		user_name: user.name,
		user_has_premium: user_profile.product === 'premium'
	};
}

export const actions = {
	create_queue: async ({ locals, request }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const name = data.get('queue_name') as string;

		const [queue] = await db
			.insert(queues)
			.values({ name, owner_id: session.userId, id: get_random_string(7) })
			.returning();

		throw redirect(303, `/queue/${queue.id}?share=true`);
	}
};

const get_random_string = (length: number) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';

	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
};
