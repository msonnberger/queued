import type { Config } from '@sveltejs/adapter-vercel';
import { error, text } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import postgres from 'pg';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';
import type { TrackObject } from '$lib/api/spotify';
import { db } from '$lib/server/db/db.js';
import { tracks } from '$lib/server/db/schema.js';
import type { PusherAddTrackEvent, PusherDeleteTrackEvent } from '$lib/types';

export const config: Config = {
	// 	runtime: 'edge',
	// 	// frankfurt only to reduce latency for DB calls
	// 	regions: ['fra1']
};

export async function POST({ request, params }) {
	const body = await request.json();
	const { track }: { track: TrackObject } = body;
	const qid = params.id;

	if (track.uri === undefined) {
		throw error(400, 'Missing track URI');
	}

	try {
		const [row] = await db.insert(tracks).values({ spotify_uri: track.uri, qid }).returning({ id: tracks.id });
		await pusher.trigger(`queue-${qid}`, 'track-added', {
			...track,
			db_id: row.id
		} satisfies PusherAddTrackEvent);
	} catch (e) {
		if (e instanceof postgres.DatabaseError && e.code === '23505') {
			throw error(409, 'Track already exists.');
		}

		throw error(500, 'Something went wrong.');
	}

	return text('OK');
}

export async function DELETE({ request, params }) {
	const body = await request.json();
	const body_schema = z.object({
		uri: z.string()
	});

	const qid = params.id;

	const result = body_schema.safeParse(body);

	if (!result.success) {
		throw error(400, result.error.toString());
	}

	try {
		await db.delete(tracks).where(and(eq(tracks.spotify_uri, result.data.uri), eq(tracks.qid, qid)));
		await pusher.trigger(`queue-${qid}`, 'track-removed', { uri: result.data.uri } satisfies PusherDeleteTrackEvent);
	} catch (e) {
		throw error(500, 'Something went wrong.');
	}

	return text('OK');
}
