import { pusher } from '$lib/api/pusher/server';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, text, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const DELETE = (async (event) => {
	const body = await event.request.json();
	const body_schema = z.object({
		uri: z.string(),
		queue_id: z.string().length(7)
	});

	const result = body_schema.safeParse(body);

	if (!result.success) {
		throw error(400, result.error.toString());
	}

	const { supabaseClient } = await getSupabase(event);

	const { error: err } = await supabaseClient
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
