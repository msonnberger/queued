import type { Config } from '@sveltejs/adapter-vercel';
import { error, text } from '@sveltejs/kit';

import { pusher } from '$lib/api/pusher/server';
import type { PusherVoteEvent } from '$lib/types';

export const config: Config = {
	runtime: 'edge',
	// european regions only to reduce latency for DB calls
	regions: ['arn1', 'cdg1', 'dub1', 'fra1', 'lhr1']
};

export async function POST({ request, locals, cookies, params }) {
	const { value, supabase_id } = await request.json();
	const voter_id = cookies.get('voter-id') ?? 'undefined';
	const qid = params.id;

	const { error: err } = await locals.supabase_admin.from('votes').insert({
		track_id: supabase_id,
		value,
		voter_id
	});

	let up_value = value > 0 ? value : 0;
	let down_value = value < 0 ? value : 0;
	let type_voted: 'up' | 'down' | null = value > 0 ? 'up' : 'down';

	if (err) {
		if (err.code !== '23505') {
			throw error(500, err.message);
		}

		// err.code === '23505' => duplicate key error
		// check for duplicate key error and remove that particular vote
		const { data, error: delete_err } = await locals.supabase_admin
			.from('votes')
			.delete()
			.eq('track_id', supabase_id)
			.eq('voter_id', voter_id)
			.select()
			.single();

		if (delete_err) {
			throw error(500, delete_err.message);
		}

		// TODO: REFACTOR THIS!!!
		if (data.value > 0 && value > 0) {
			up_value = -data.value;
			type_voted = null;
		} else if (data.value < 0 && value < 0) {
			down_value = -data.value;
			type_voted = null;
		} else if (data.value > 0 && value < 0) {
			up_value = -data.value;
			down_value = value;

			await locals.supabase_admin.from('votes').insert({
				track_id: supabase_id,
				value: value,
				voter_id
			});
		} else if (data.value < 0 && value > 0) {
			up_value = value;
			down_value = -data.value;

			await locals.supabase_admin.from('votes').insert({
				track_id: supabase_id,
				value: value,
				voter_id
			});
		}
	}

	const data: PusherVoteEvent = {
		supabase_track_id: supabase_id,
		up_value,
		down_value,
		type_voted,
		voter_id
	};

	pusher.trigger(`queue-${qid}`, 'vote', data);

	return text('OK');
}
