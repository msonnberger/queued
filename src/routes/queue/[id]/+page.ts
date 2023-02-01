import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { createQueueStore, type QueueStore } from '$lib/stores';
import type { TrackObject } from '$lib/api/spotify';

export const load = (async (event) => {
	const { params, fetch } = event;
	const { supabaseClient } = await getSupabase(event);

	const { data: queue, error: err } = await supabaseClient.from('queues').select().eq('id', params.id).single();

	if (err || !queue) {
		throw error(404, 'This Queue does not exist.');
	}

	// TODO: combine into one query if possible
	const { data: tracks, error: err2 } = await supabaseClient.from('tracks').select('*, votes(*)').eq('qid', queue.id);

	if (err2) {
		throw error(500, err2.message);
	}

	const track_ids = tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');
	const initial_value: QueueStore = { name: queue.name, id: queue.id, tracks: [] };

	if (track_ids) {
		const tracks_response = await fetch(`/api/get-tracks?track_ids=${track_ids}`);
		const tracks_objects = (await tracks_response.json()) as TrackObject[];

		initial_value.tracks =
			tracks?.map((track, i) => {
				return {
					...tracks_objects[i],
					db_id: track.id,
					votes: {
						// TODO: fix this
						up: track.votes
							// @ts-expect-error wrong supabase type
							?.map((vote) => vote.value)
							// @ts-expect-error wrong supabase type
							.filter((value) => value > 0)
							.reduce((acc: number, curr: number) => acc + curr, 0),
						down: track.votes
							// @ts-expect-error wrong supabase type
							?.map((vote) => vote.value)
							// @ts-expect-error wrong supabase type
							.filter((value) => value < 0)
							.reduce((acc: number, curr: number) => acc + curr, 0)
					}
				};
			}) ?? [];
	}

	return {
		queue: createQueueStore(initial_value)
	};
}) satisfies PageLoad;
