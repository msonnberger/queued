import { readable } from 'svelte/store';
import type { Database } from './api/supabase.types';
import type { TrackObject } from './api/spotify';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/api/supabase';
import { pusher_client } from './api/pusher/client';

type Queue = Database['public']['Tables']['queues']['Row'];

interface QueueStore extends Pick<Queue, 'name' | 'id'> {
	tracks: Array<Omit<TrackObject, 'id'> & { id: number; votes: { up: number; down: number } }>;
}

export const createQueueStore = async (queue: Queue) => {
	const { data: tracks, error: err } = await supabase.from('tracks').select('*, votes(*)').eq('qid', queue.id);

	if (err) {
		throw error(500, err.message);
	}

	const track_ids = tracks?.map((track) => track.spotify_uri.split(':').at(-1)).join(',');
	const initial_value: QueueStore = { name: queue.name, id: queue.id, tracks: [] };

	if (track_ids) {
		// TODO: correct hostname based on environment
		const tracks_response = await fetch(`http://localhost:5173/api/get-tracks?track_ids=${track_ids}`);
		const tracks_objects = (await tracks_response.json()) as TrackObject[];

		initial_value.tracks =
			tracks?.map((track, i) => {
				return {
					...tracks_objects[i],
					id: track.id,
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

	const queue_store = readable(initial_value, (set) => {
		const channel = pusher_client.subscribe(`queue-${queue.id}`);
		channel.bind('track-added', (data: TrackObject) => {
			// TODO: fix this
			//set({ ...get(queue_store), tracks: [...get(queue_store).tracks, { ...data, id: 0, votes: { up: 0, down: 0 } }] });
			console.log(data);
		});
	});

	return queue_store;
};
