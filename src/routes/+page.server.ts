import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

export const actions = {
	login: async ({ locals }) => {
		const redirectTo = env.SITE_URL ?? (env.VERCEL_URL ? `https://${env.VERCEL_URL}/` : 'http://localhost:5173/');

		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'spotify',
			options: { redirectTo }
		});

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
