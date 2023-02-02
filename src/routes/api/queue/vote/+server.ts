import { pusher } from '$lib/api/pusher/server';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, text, type RequestHandler } from '@sveltejs/kit';

export const POST = (async (event) => {
	const { value, supabase_id, queue_id } = await event.request.json();
	const { supabaseClient } = await getSupabase(event);

	const { error: err } = await supabaseClient.from('votes').insert({
		track_id: supabase_id,
		value,
		voter_id: event.cookies.get('voter-id') ?? 'anonymous'
	});

	if (err) {
		throw error(500, err.message);
	}

	pusher.trigger(`queue-${queue_id}`, 'vote', { supabase_track_id: supabase_id, value });

	return text('OK');
}) satisfies RequestHandler;
