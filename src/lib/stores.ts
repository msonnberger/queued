import { readable } from 'svelte/store';
import type { Database } from './api/supabase.types';
import type { TrackObject } from './api/spotify';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/api/supabase';

type Queue = Database['public']['Tables']['queues']['Row'];

interface QueueStore {
	name: string;
	id: number;
	tracks: Array<TrackObject & { votes: { up: number; down: number } }>;
}

export const createQueueStore = async (queue: Queue) => {
	const { data: tracks, error: err } = await supabase.from('tracks').select('*, votes (*)').eq('queue_id', queue.id);

	if (err) {
		throw error(500, err.message);
	}

	const track_ids = tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');
	const initial_value: QueueStore = { name: queue.name, id: queue.id, tracks: [] };

	if (track_ids) {
		const tracks_response = await fetch(`http://localhost:5173/api/get-tracks?track_ids=${track_ids}`);
		const tracks_objects = (await tracks_response.json()) as TrackObject[];

		initial_value.tracks =
			tracks?.map((track, i) => {
				return {
					...tracks_objects[i],
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

	return readable(initial_value);
};
