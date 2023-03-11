import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST = (async ({ locals }) => {
	const { error: err } = await locals.supabase.auth.signOut();

	if (err) {
		throw error(500, 'Something went wrong. Please try again later.');
	}

	throw redirect(303, '/');
}) satisfies RequestHandler;
