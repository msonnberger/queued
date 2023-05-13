import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db/db';
import { queues, votes } from '$lib/server/db/schema';
import { auth } from '$lib/server/lucia';

export async function load({ locals }) {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(307, '/');
	}

	const data = await db
		.select({ id: queues.id, name: queues.name })
		.from(queues)
		.where(eq(queues.owner_id, session.userId));

	return { session, queues: data };
}

export const actions = {
	delete_queue: async ({ request, locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw error(401);
		}

		const data = await request.formData();
		const qid = data.get('qid') as string;

		if (!qid) {
			return fail(400, { message: 'QID is required.' });
		}

		await db.delete(queues).where(eq(queues.id, qid));
	},
	delete_account: async ({ locals, cookies }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw error(401);
		}

		try {
			await db.transaction(async (tx) => {
				if (cookies.get('voter-id') !== undefined) {
					await tx.delete(votes).where(eq(votes.voter_id, cookies.get('voter-id') as string));
				}

				await auth.deleteUser(session.userId);
				cookies.delete('voter-id', { path: '/' });
			});

			throw redirect(303, '/');
		} catch (err) {
			return fail(500, { message: 'Could not delete your Account' });
		}
	}
};
