import type { Config } from '@sveltejs/adapter-vercel';
import { error, text } from '@sveltejs/kit';

import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';

export const config: Config = {
	runtime: 'edge',
	// frankfurt only to reduce latency for DB calls
	regions: ['fra1']
};

export async function POST({ request, locals, fetch, params }) {
	const { uri } = await request.json();
	const qid = params.id;

	const { data, error: err } = await locals.supabase_admin
		.from('queues')
		.update({ current_track_uri: uri })
		.eq('id', qid)
		.select()
		.single();

	if (err) {
		throw error(500, 'Something went wrong.');
	}

	let current_track = null;

	if (data.current_track_uri) {
		const tracks_response = await fetch(`/api/get-tracks?track_ids=${data.current_track_uri.split(':').at(-1)}`);
		const tracks = (await tracks_response.json()) as TrackObject[];
		current_track = tracks[0];
	}

	await pusher.trigger(`queue-${qid}`, 'current-track-updated', current_track);

	return text('OK');
}
