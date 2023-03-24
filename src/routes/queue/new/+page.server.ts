import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create_queue: async ({ locals, request }) => {
		const session = await locals.get_session();

		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const name = data.get('queue_name') as string;

		const { data: queue, error: err } = await locals.supabase
			.from('queues')
			.insert({ name, owner_id: session.user.id, id: get_random_string(7) })
			.select()
			.single();

		if (err) {
			throw error(500, err.message);
		}

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
