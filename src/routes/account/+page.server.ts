import { error, fail, redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia.js';

export async function load({ locals }) {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(307, '/');
	}

	const { data, error: err } = await locals.supabase_admin
		.from('queues')
		.select('name, id')
		.eq('owner_id', session.userId);

	if (err) {
		console.error(err);
		throw error(500, 'Something went wrong when fetching Queues');
	}

	return { session, queues: data };
}

export const actions = {
	delete_queue: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const qid = data.get('qid');

		if (!qid) {
			return fail(400, { message: 'QID is required.' });
		}

		const { error: err } = await locals.supabase_admin.from('queues').delete().eq('id', qid);

		if (err) {
			return fail(500, { message: 'Could not delete Queue.' });
		}
	},
	delete_account: async ({ locals, cookies }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const { error: err } = await locals.supabase_admin.from('queues').delete().eq('owner_id', session.userId);
		await auth.deleteUser(session.userId);
		cookies.delete('voter-id', { path: '/' });

		if (err) {
			return fail(500, { message: 'Could not delete your Queues' });
		}
	}
};
