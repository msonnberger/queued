import { writable } from 'svelte/store';
import type { Database } from './api/supabase.types';
import type { TrackObject } from './api/spotify';
import { pusher_client } from './api/pusher/client';

type Queue = Database['public']['Tables']['queues']['Row'];

export interface QueueStore extends Pick<Queue, 'name' | 'id'> {
	tracks: Array<TrackObject & { supabase_id: number; votes: { up: number; down: number } }>;
}

export const createQueueStore = async (initial_value: QueueStore) => {
	const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

	channel.bind('track-added', (data: TrackObject & { supabase_id: number }) => {
		const new_track = { ...data, votes: { up: 0, down: 0 } };
		update((value) => ({ ...value, tracks: [...value.tracks, new_track] }));
	});

	channel.bind('vote', (data: { supabase_track_id: number; value: number }) => {
		update((value) => {
			const track_index = value.tracks.findIndex((track) => track.supabase_id === data.supabase_track_id);

			if (track_index === undefined) {
				return value;
			}

			value.tracks[track_index].votes[data.value > 0 ? 'up' : 'down'] += data.value;
			value.tracks.sort((a, b) => b.votes.up + b.votes.down - (a.votes.up + a.votes.down));
			return value;
		});
	});

	const { subscribe, update } = writable<QueueStore>(initial_value, () => {
		return () => channel.unbind_all();
	});

	return { subscribe };
};
