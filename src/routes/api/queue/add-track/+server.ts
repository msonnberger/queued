import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, text, type RequestHandler } from '@sveltejs/kit';

export const POST = (async (event) => {
	const body = await event.request.json();
	const { track, queue_id }: { track: TrackObject; queue_id: string } = body;

	if (track.uri === undefined) {
		throw error(400, 'Missing track URI');
	}

	const { supabaseClient } = await getSupabase(event);

	const { error: err } = await supabaseClient.from('tracks').insert({
		spotify_uri: track.uri,
		qid: queue_id
	});

	if (err) {
		throw error(500, err.message);
	}

	pusher.trigger(`queue-${queue_id}`, 'track-added', { track });

	return text('OK');
}) satisfies RequestHandler;
