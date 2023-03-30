import { error } from '@sveltejs/kit';

import type { TrackObject } from '$lib/api/spotify';
import { create_player_store, create_queue_store } from '$lib/stores';
import type { Queue, SupabaseTrack, SupabaseVote } from '$lib/types';

export async function load({ params, fetch, data, parent }) {
	const { supabase } = await parent();

	const { data: queue, error: err } = await supabase
		.from('queues')
		.select('*, tracks!tracks_qid_fkey(*, votes(*))')
		.eq('id', params.id)
		.single();

	if (err || !queue) {
		throw error(404, 'This Queue does not exist.');
	}

	const supabase_tracks = queue.tracks as Array<SupabaseTrack & { votes: Array<SupabaseVote> }>;
	const currently_playing_id = queue.current_track_uri?.split(':').at(-1);
	let spotify_track_ids = supabase_tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');

	if (currently_playing_id) {
		spotify_track_ids = spotify_track_ids ? `${currently_playing_id},${spotify_track_ids}` : currently_playing_id;
	}

	const initial_value: Queue = { name: queue.name, id: queue.id, owner_id: queue.owner_id, tracks: [] };
	let currently_playing_track: TrackObject | undefined;

	if (spotify_track_ids) {
		const spotify_tracks_response = await fetch(`/api/get-tracks?track_ids=${spotify_track_ids}`);
		let spotify_tracks = (await spotify_tracks_response.json()) as TrackObject[];

		if (currently_playing_id) {
			currently_playing_track = spotify_tracks[0];
			spotify_tracks = spotify_tracks.slice(1);
		}

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

	initial_value.currently_playing = currently_playing_track;

	return {
		queue: create_queue_store(initial_value, data.voter_id),
		player: create_player_store(),
		spotify_access_token: data.spotify_access_token
	};
}
