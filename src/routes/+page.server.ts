import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
//import { VITE_VERCEL_URL } from '$env/static/private';
import { env } from '$env/dynamic/private';

export const actions = {
	login: async ({ locals }) => {
		const url = env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:5173';
		//console.log(VITE_VERCEL_URL);
		const redirectTo = url.at(-1) === '/' ? url : `${url}/`;
		console.log(redirectTo);
		console.log(process.env);
		console.log({ env });
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
