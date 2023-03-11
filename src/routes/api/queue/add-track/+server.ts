import { error, text, type RequestHandler } from '@sveltejs/kit';

import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';

export const POST = (async ({ request, locals }) => {
	const body = await request.json();
	const { track, queue_id }: { track: TrackObject; queue_id: string } = body;

	if (track.uri === undefined) {
		throw error(400, 'Missing track URI');
	}

	const { data, error: err } = await locals.supabase
		.from('tracks')
		.insert({
			spotify_uri: track.uri,
			qid: queue_id
		})
		.select('id')
		.single();

	// Check for duplicate entry in Supabase
	if (err?.code === '23505') {
		throw error(409, err.message);
	} else if (err) {
		throw error(500, err.message);
	}

	pusher.trigger(`queue-${queue_id}`, 'track-added', { ...track, supabase_id: data.id });

	return text('OK');
}) satisfies RequestHandler;
