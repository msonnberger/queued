import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async (event) => {
	const { uri, qid } = await event.request.json();
	const { supabaseClient } = await getSupabase(event);

	const { data, error: err } = await supabaseClient
		.from('queues')
		.update({ current_track_uri: uri })
		.eq('id', qid)
		.select()
		.single();

	if (err || !data.current_track_uri) {
		throw error(500, 'Something went wrong.');
	}

	const tracks_response = await event.fetch(`/api/get-tracks?track_ids=${data.current_track_uri.split(':').at(-1)}`);
	const tracks = (await tracks_response.json()) as TrackObject[];

	pusher.trigger(`queue-${qid}`, 'current-track-updated', tracks[0]);

	return text('OK');
}) satisfies RequestHandler;
