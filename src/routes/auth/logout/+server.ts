import { redirect } from '@sveltejs/kit';

import { auth } from '$lib/server/lucia.js';

export async function POST({ locals }) {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(303, '/');
	}

	await auth.invalidateSession(session?.sessionId);

	throw redirect(303, '/');
}
