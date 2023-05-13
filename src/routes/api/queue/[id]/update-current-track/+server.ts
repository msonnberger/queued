import type { Config } from '@sveltejs/adapter-vercel';
import { error, text } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';
import { db } from '$lib/server/db/db.js';
import { queues } from '$lib/server/db/schema.js';

export const config: Config = {
	// 	runtime: 'edge',
	// 	// frankfurt only to reduce latency for DB calls
	// 	regions: ['fra1']
};

export async function POST({ request, fetch, params }) {
	const { uri } = await request.json();
	const qid = params.id;

	try {
		const [data] = await db.update(queues).set({ current_track_uri: uri }).where(eq(queues.id, qid)).returning();
		let current_track = null;

		if (data.current_track_uri) {
			const tracks_response = await fetch(`/api/get-tracks?track_ids=${data.current_track_uri.split(':').at(-1)}`);
			const tracks = (await tracks_response.json()) as TrackObject[];
			current_track = tracks[0];
		}

		await pusher.trigger(`queue-${qid}`, 'current-track-updated', current_track);
	} catch (e) {
		throw error(500, 'Something went wrong.');
	}

	return text('OK');
}
