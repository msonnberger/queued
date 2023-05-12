import type { Config } from '@sveltejs/adapter-vercel';
import { error, type Cookies } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';
import { db } from '$lib/server/db/db.js';
import { votes } from '$lib/server/db/schema.js';
import type { PusherVoteEvent } from '$lib/types';

export const config: Config = {
	// 	runtime: 'edge',
	// 	// frankfurt only to reduce latency for DB calls
	// 	regions: ['fra1']
};

const track_id_scheme = z.object({
	supabase_track_id: z.number().int().positive()
});

function get_voter_id(cookies: Cookies) {
	const voter_id = cookies.get('voter-id');

	if (voter_id === undefined) {
		throw error(500, 'No Voter ID provided');
	}

	return voter_id;
}

export async function DELETE({ request, cookies, params }) {
	const body = await request.json();
	const parsed = track_id_scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id } = parsed.data;
	const voter_id = get_voter_id(cookies);

	try {
		const [deleted_vote] = await db
			.delete(votes)
			.where(and(eq(votes.track_id, supabase_track_id), eq(votes.voter_id, voter_id)))
			.returning();

		return pusher.trigger(`queue-${params.id}`, 'vote', {
			supabase_track_id,
			up_value: -Math.max(deleted_vote.value, 0),
			down_value: -Math.min(deleted_vote.value, 0),
			type_voted: null,
			voter_id
		} satisfies PusherVoteEvent);
	} catch (e) {
		throw error(500, 'Something went wrong.');
	}
}

export async function POST({ request, cookies, params }) {
	const body_scheme = track_id_scheme.extend({
		value: z.union([z.literal(1), z.literal(-1)]),
		is_vote_flipped: z.boolean().optional()
	});
	const body = await request.json();
	const parsed = body_scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id, value, is_vote_flipped } = parsed.data;
	const voter_id = get_voter_id(cookies);

	try {
		await db
			.insert(votes)
			.values({
				track_id: supabase_track_id,
				value,
				voter_id
			})
			.onConflictDoUpdate({ target: [votes.track_id, votes.voter_id], set: { value } });

		return pusher.trigger(`queue-${params.id}`, 'vote', {
			supabase_track_id,
			up_value: is_vote_flipped ? value : Math.max(value, 0),
			down_value: is_vote_flipped ? value : Math.min(value, 0),
			type_voted: value > 0 ? 'up' : 'down',
			voter_id
		} satisfies PusherVoteEvent);
	} catch (e) {
		throw error(500, 'Something went wrong.');
	}
}
