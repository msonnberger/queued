import type { Config } from '@sveltejs/adapter-vercel';
import { error, type Cookies } from '@sveltejs/kit';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';
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

export async function DELETE({ request, locals, cookies, params }) {
	const body = await request.json();
	const parsed = track_id_scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id } = parsed.data;
	const voter_id = get_voter_id(cookies);

	const { data: deleted_vote, error: delete_err } = await locals.supabase_admin
		.from('votes')
		.delete()
		.eq('track_id', supabase_track_id)
		.eq('voter_id', voter_id)
		.select()
		.single();

	if (delete_err) {
		throw error(500, 'Vote could not be removed');
	}

	return pusher.trigger(`queue-${params.id}`, 'vote', {
		supabase_track_id,
		up_value: -Math.max(deleted_vote.value, 0),
		down_value: -Math.min(deleted_vote.value, 0),
		type_voted: null,
		voter_id
	} satisfies PusherVoteEvent);
}

export async function POST({ request, locals, cookies, params }) {
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

	const { error: insert_err } = await locals.supabase_admin.from('votes').upsert({
		track_id: supabase_track_id,
		value,
		voter_id
	});

	if (insert_err) {
		throw error(500, 'Vote could not be saved');
	}

	return pusher.trigger(`queue-${params.id}`, 'vote', {
		supabase_track_id,
		up_value: is_vote_flipped ? value : Math.max(value, 0),
		down_value: is_vote_flipped ? value : Math.min(value, 0),
		type_voted: value > 0 ? 'up' : 'down',
		voter_id
	} satisfies PusherVoteEvent);
}
