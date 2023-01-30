import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';

export const POST = (async ({ locals, url }) => {
	let redirect_to = env.SITE_URL ?? (env.VERCEL_URL ? `https://${env.VERCEL_URL}/` : 'http://localhost:5173/');
	redirect_to += url.searchParams.get('path') ?? '';

	const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: { redirectTo: redirect_to }
	});

	if (err) {
		throw error(500, 'Something went wrong. Please try again later.');
	}

	throw redirect(303, data.url);
}) satisfies RequestHandler;
