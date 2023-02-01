import { randomUUID } from 'crypto';
import type { PageServerLoad, Actions } from './$types';

export const load = (async ({ cookies }) => {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}
}) satisfies PageServerLoad;

export const actions = {
	add_track: async ({ request, locals }) => {
		const form_data = await request.formData();
		const spotify_uri = form_data.get('spotify_uri') as string;
		const queue_id = Number(form_data.get('queue_id') as string);

		const { data, error: err } = await locals.supabase.from('tracks').insert({
			spotify_uri,
			queue_id
		});

		console.log(data, err);
	}
} satisfies Actions;
