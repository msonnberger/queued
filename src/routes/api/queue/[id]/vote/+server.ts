import type { Config } from '@sveltejs/adapter-vercel';
import { error, json, type Cookies } from '@sveltejs/kit';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';
import type { PusherVoteEvent } from '$lib/types';

export const config: Config = {
	runtime: 'edge',
	// frankfurt only to reduce latency for DB calls
	regions: ['fra1']
};

const body_scheme = z.object({
	supabase_track_id: z.number().int().positive(),
	is_vote_flipped: z.boolean().optional()
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
	const parsed = body_scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id, is_vote_flipped } = parsed.data;
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

	if (is_vote_flipped) {
		return json(deleted_vote);
	}

	return pusher.trigger(`queue-${params.id}`, 'vote', {
		supabase_track_id,
		up_value: -Math.max(deleted_vote.value, 0),
		down_value: -Math.min(deleted_vote.value, 0),
		type_voted: null,
		voter_id
	} satisfies PusherVoteEvent);
}

export async function POST({ request, locals, cookies, params, fetch, url }) {
	const scheme = body_scheme.extend({ value: z.union([z.literal(1), z.literal(-1)]) });
	const body = await request.json();
	const parsed = scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id, value, is_vote_flipped } = parsed.data;
	const voter_id = get_voter_id(cookies);

	let up_value = Math.max(value, 0);
	let down_value = Math.min(value, 0);

	if (is_vote_flipped) {
		const delete_res = await fetch(url.pathname, {
			method: 'DELETE',
			body: JSON.stringify({ supabase_track_id, is_vote_flipped })
		});

		const deleted_vote = await delete_res.json();

		if (value < 0) {
			up_value = -deleted_vote.value;
			down_value = value;
		} else {
			up_value = value;
			down_value = -deleted_vote.value;
		}
	}

	const { error: insert_err } = await locals.supabase_admin.from('votes').insert({
		track_id: supabase_track_id,
		value,
		voter_id
	});

	if (insert_err) {
		throw error(500, 'Vote could not be saved');
	}

	return pusher.trigger(`queue-${params.id}`, 'vote', {
		supabase_track_id,
		up_value,
		down_value,
		type_voted: value > 0 ? 'up' : 'down',
		voter_id
	} satisfies PusherVoteEvent);
}
