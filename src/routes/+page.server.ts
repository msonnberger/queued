import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	login: async ({ locals }) => {
		const { data, error: err } = await locals.supabase.auth.signInWithOAuth({ provider: 'spotify' });

		if (err) {
			return fail(400, { message: 'Something went wrong. Please try again later.' });
		}

		throw redirect(303, data.url);
	},
	logout: async ({ locals }) => {
		const { error: err } = await locals.supabase.auth.signOut();

		if (err) {
			return fail(400, { message: 'Something went wrong. Please try again later.' });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
