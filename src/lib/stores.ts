import { writable } from 'svelte/store';
import { pusher_client } from './api/pusher/client';
import type { QueueStore, QueueTrack } from './types';
import { sorted_queue } from './utils';

export const createQueueStore = async (initial_value: QueueStore) => {
	const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

	channel.bind('track-added', (data: Omit<QueueTrack, 'votes'>) => {
		const new_track = { ...data, votes: { up: 0, down: 0 } };
		update((value) => sorted_queue({ ...value, tracks: [...value.tracks, new_track] }));
	});

	channel.bind('vote', (data: { supabase_track_id: number; value: number }) => {
		update((value) => {
			const track_index = value.tracks.findIndex((track) => track.supabase_id === data.supabase_track_id);

			if (track_index === undefined) {
				return value;
			}

			value.tracks[track_index].votes[data.value > 0 ? 'up' : 'down'] += data.value;

			return sorted_queue(value);
		});
	});

	const { subscribe, update } = writable<QueueStore>(sorted_queue(initial_value), () => {
		return () => channel.unbind_all();
	});

	return { subscribe };
};
