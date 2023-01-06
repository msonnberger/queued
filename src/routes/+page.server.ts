import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	login: async ({ locals }) => {
		const { data, error } = await locals.supabase.auth.signInWithOAuth({ provider: 'spotify' });

		if (error) {
			return fail(500, { error: 'Something went wrong. Please try again later.' });
		}

		throw redirect(303, data.url);
	},
	logout: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();

		if (error) {
			return fail(500, { error: 'Something went wrong. Please try again later.' });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
