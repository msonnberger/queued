import type { Config } from '@sveltejs/adapter-vercel';
import { error, text } from '@sveltejs/kit';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';

export const config: Config = {
	runtime: 'edge',
	// frankfurt only to reduce latency for DB calls
	regions: ['fra1']
};

export async function DELETE({ request, locals, params }) {
	const body = await request.json();
	const body_schema = z.object({
		uri: z.string()
	});

	const qid = params.id;

	const result = body_schema.safeParse(body);

	if (!result.success) {
		throw error(400, result.error.toString());
	}

	const { error: err } = await locals.supabase_admin
		.from('tracks')
		.delete()
		.eq('spotify_uri', result.data.uri)
		.eq('qid', qid);

	if (err) {
		throw error(500, err.message);
	}

	await pusher.trigger(`queue-${qid}`, 'track-removed', { uri: result.data.uri });

	return text('OK');
}
