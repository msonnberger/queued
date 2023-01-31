import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create_queue: async ({ locals, request }) => {
		if (!locals.session) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const name = data.get('queue_name') as string;

		const { data: queue, error: err } = await locals.supabase
			.from('queue')
			.insert({ name, owner_id: locals.session.user.id, qid: get_random_string(6) })
			.select()
			.single();

		if (err) {
			throw error(500, err.message);
		}

		throw redirect(303, `/queue/${queue.qid}`);
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
