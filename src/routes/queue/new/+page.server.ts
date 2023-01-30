import { getMe } from '$lib/api/spotify';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/queue/new/login');
	}

	const user_profile = await getMe({ headers: { Authorization: `Bearer ${locals.session.provider_token}` } });
	const user_has_premium = user_profile.product === 'premium';

	return {
		user_has_premium
	};
}) satisfies PageServerLoad;

export const actions = {
	create_queue: async ({ locals, request }) => {
		if (!locals.session) {
			throw redirect(303, '/queue/new/login');
		}

		const data = await request.formData();
		const name = data.get('queue_name') as string;

		const { data: queue, error } = await locals.supabase
			.from('queue')
			.insert({ name, owner_id: locals.session.user.id, join_code: get_random_string(6) })
			.select()
			.single();

		return {
			success: !error,
			queue
		};
	}
} satisfies Actions;

const get_random_string = (length: number) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';

	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return result;
};
