import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { create_player_store, create_queue_store } from '$lib/stores';
import type { TrackObject } from '$lib/api/spotify';
import type { SupabaseTrack, SupabaseVote, QueueStore } from '$lib/types';
import { browser } from '$app/environment';
import type { Readable } from 'svelte/store';

let queue_store: Readable<QueueStore>;

export const load = (async (event) => {
	const { params, fetch, data } = event;
	const { supabaseClient } = await getSupabase(event);

	const { data: queue, error: err } = await supabaseClient
		.from('queues')
		.select('*, tracks!tracks_qid_fkey(*, votes(*))')
		.eq('id', params.id)
		.single();

	if (err || !queue) {
		throw error(404, 'This Queue does not exist.');
	}

	const supabase_tracks = queue.tracks as Array<SupabaseTrack & { votes: Array<SupabaseVote> }>;
	const spotify_track_ids = supabase_tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');
	const initial_value: Partial<QueueStore> = { name: queue.name, id: queue.id, tracks: [] };

	if (spotify_track_ids) {
		const spotify_tracks_response = await fetch(`/api/get-tracks?track_ids=${spotify_track_ids}`);
		const spotify_tracks = (await spotify_tracks_response.json()) as TrackObject[];

		initial_value.tracks =
			supabase_tracks?.map((supabase_track, i) => {
				const votes = supabase_track.votes;
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
		queue: browser
			? queue_store || (queue_store = create_queue_store(initial_value, data.voter_id))
			: create_queue_store(initial_value, data.voter_id),
		player: create_player_store()
	};
}) satisfies PageLoad;
