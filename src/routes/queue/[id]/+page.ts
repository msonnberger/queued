import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { createQueueStore } from '$lib/stores';
import type { TrackObject } from '$lib/api/spotify';
import type { QueueStore } from '$lib/types';
import type { Database } from '$lib/api/supabase.types';

export const ssr = false;

export const load = (async (event) => {
	const { params, fetch, data } = event;
	const { supabaseClient } = await getSupabase(event);

	const { data: queue, error: err } = await supabaseClient.from('queues').select().eq('id', params.id).single();

	if (err || !queue) {
		throw error(404, 'This Queue does not exist.');
	}

	// TODO: combine into one query if possible
	const { data: supabase_tracks, error: err2 } = await supabaseClient
		.from('tracks')
		.select('*, votes(*)')
		.eq('qid', queue.id);

	if (err2) {
		throw error(500, err2.message);
	}

	const spotify_track_ids = supabase_tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');
	const initial_value: Omit<QueueStore, 'handle_vote'> = { name: queue.name, id: queue.id, tracks: [] };

	if (spotify_track_ids) {
		const spotify_tracks_response = await fetch(`/api/get-tracks?track_ids=${spotify_track_ids}`);
		const spotify_tracks = (await spotify_tracks_response.json()) as TrackObject[];

		initial_value.tracks =
			supabase_tracks?.map((supabase_track, i) => {
				const votes = supabase_track.votes as Array<Database['public']['Tables']['votes']['Row']>;
				return {
					...spotify_tracks[i],
					supabase_id: supabase_track.id,
					votes: {
						// TODO: fix this
						up: votes
							.map((vote) => vote.value)
							.filter((value) => value > 0)
							.reduce((acc: number, curr: number) => acc + curr, 0),
						down: votes
							.map((vote) => vote.value)
							.filter((value) => value < 0)
							.reduce((acc: number, curr: number) => acc + curr, 0),
						own_vote: votes.some((vote) => vote.value > 0 && vote.voter_id === data.voter_id)
							? 'up'
							: votes.some((vote) => vote.value < 0 && vote.voter_id === data.voter_id)
							? 'down'
							: null
					}
				};
			}) ?? [];
	}

	return {
		queue: createQueueStore(initial_value, data.voter_id)
	};
}) satisfies PageLoad;
