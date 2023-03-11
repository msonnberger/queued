import { error, text, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';

export const DELETE = (async ({ request, locals }) => {
	const body = await request.json();
	const body_schema = z.object({
		uri: z.string(),
		queue_id: z.string().length(7)
	});

	const result = body_schema.safeParse(body);

	if (!result.success) {
		throw error(400, result.error.toString());
	}

	const { error: err } = await locals.supabase
		.from('tracks')
		.delete()
		.eq('spotify_uri', result.data.uri)
		.eq('qid', result.data.queue_id);

	if (err) {
		throw error(500, err.message);
	}

	pusher.trigger(`queue-${result.data.queue_id}`, 'track-removed', { uri: result.data.uri });

	return text('OK');
}) satisfies RequestHandler;
