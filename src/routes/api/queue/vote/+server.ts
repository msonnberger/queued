import { pusher } from '$lib/api/pusher/server';
import type { PusherVoteEvent } from '$lib/types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, text, type RequestHandler } from '@sveltejs/kit';

export const POST = (async (event) => {
	const { value, supabase_id, queue_id } = await event.request.json();
	const { supabaseClient } = await getSupabase(event);
	const voter_id = event.cookies.get('voter-id') ?? 'undefined';

	const { error: err } = await supabaseClient.from('votes').insert({
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
		const { data, error: delete_err } = await supabaseClient
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

			await supabaseClient.from('votes').insert({
				track_id: supabase_id,
				value: value,
				voter_id
			});
		} else if (data.value < 0 && value > 0) {
			up_value = value;
			down_value = -data.value;

			await supabaseClient.from('votes').insert({
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

	pusher.trigger(`queue-${queue_id}`, 'vote', data);

	return text('OK');
}) satisfies RequestHandler;
