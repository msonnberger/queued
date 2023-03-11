import { error, redirect } from '@sveltejs/kit';

export async function POST({ locals, url }) {
	const redirect_to = `${url.origin}/${url.searchParams.get('path') ?? ''}`;

	const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
		provider: 'spotify',
		options: {
			redirectTo: redirect_to,
			scopes:
				'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing streaming'
		}
	});

	if (err) {
		throw error(500, 'Something went wrong. Please try again later.');
	}

	throw redirect(303, data.url);
}
