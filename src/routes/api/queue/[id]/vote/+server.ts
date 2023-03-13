import type { Config } from '@sveltejs/adapter-vercel';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

import { pusher } from '$lib/api/pusher/server';
import type { PusherVoteEvent } from '$lib/types';

export const config: Config = {
	runtime: 'edge',
	// frankfurt only to reduce latency for DB calls
	regions: ['fra1']
};

export async function POST({ request, locals, cookies, params }) {
	const body_scheme = z.object({
		value: z.union([z.literal(1), z.literal(-1)]),
		supabase_track_id: z.number().int().positive()
	});

	const body = await request.json();
	const parsed = body_scheme.safeParse(body);

	if (!parsed.success) {
		throw error(400, 'Invalid data');
	}

	const { supabase_track_id, value } = parsed.data;
	const voter_id = cookies.get('voter-id');

	if (voter_id === undefined) {
		throw error(500, 'No Voter ID provided');
	}

	const { error: insert_err } = await locals.supabase_admin.from('votes').insert({
		track_id: supabase_track_id,
		value,
		voter_id
	});

	// throw if not an duplicate key error
	if (insert_err && insert_err.code !== '23505') {
		throw error(500, 'Vote could not be saved');
	}

	let up_value = Math.max(value, 0);
	let down_value = Math.min(value, 0);
	let type_voted: 'up' | 'down' | null = value > 0 ? 'up' : 'down';

	// err.code === '23505' => duplicate key error
	// check for duplicate key error and remove that particular vote
	if (insert_err && insert_err.code === '23505') {
		const { data: deleted_vote, error: delete_err } = await locals.supabase_admin
			.from('votes')
			.delete()
			.eq('track_id', supabase_track_id)
			.eq('voter_id', voter_id)
			.select()
			.single();

		if (delete_err) {
			throw error(500, 'Vote could not be saved');
		}

		const old_value = deleted_vote.value;
		const new_value = value;

		if (old_value > 0 && new_value > 0) {
			up_value = -old_value;
			type_voted = null;
		} else if (old_value < 0 && new_value < 0) {
			down_value = -old_value;
			type_voted = null;
		} else {
			const { error: insert_err } = await locals.supabase_admin.from('votes').insert({
				track_id: supabase_track_id,
				value: new_value,
				voter_id
			});

			if (insert_err) {
				throw error(500, 'Vote could not be saved');
			}

			if (new_value < 0) {
				up_value = -old_value;
				down_value = new_value;
			} else {
				up_value = new_value;
				down_value = -old_value;
			}
		}
	}

	return pusher.trigger(`queue-${params.id}`, 'vote', {
		supabase_track_id,
		up_value,
		down_value,
		type_voted,
		voter_id
	} satisfies PusherVoteEvent);
}
