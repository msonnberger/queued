import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const POST = (async ({ locals, url }) => {
	const redirect_to = `${url.origin}/${url.searchParams.get('path') ?? ''}`;

	const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: { redirectTo: redirect_to, scopes: 'user-read-private' }
	});

	if (err) {
		throw error(500, 'Something went wrong. Please try again later.');
	}

	throw redirect(303, data.url);
}) satisfies RequestHandler;
