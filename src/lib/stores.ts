import { derived, writable } from 'svelte/store';
import { pusher_client } from './api/pusher/client';
import type { QueueStore, QueueTrack } from './types';
import { sorted_queue } from './utils';

export const createQueueStore = async (initial_value: QueueStore) => {
	const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

	channel.bind('track-added', (data: Omit<QueueTrack, 'votes'>) => {
		const new_track = { ...data, votes: { up: 0, down: 0, has_upvoted: false, has_downvoted: false } };
		queue_writable.update((value) => ({ ...value, tracks: [...value.tracks, new_track] }));
	});

	channel.bind('vote', (data: { supabase_track_id: number; up_value: number; down_value: number }) => {
		queue_writable.update((value) => {
			const track_index = value.tracks.findIndex((track) => track.supabase_id === data.supabase_track_id);

			if (track_index === undefined) {
				return value;
			}

			value.tracks[track_index].votes.up += data.up_value;
			value.tracks[track_index].votes.down += data.down_value;

			return value;
		});
	});

	const queue_writable = writable<QueueStore>(initial_value, () => {
		return () => channel.unbind_all();
	});

	const { subscribe } = derived(queue_writable, ($queue_writeable) => sorted_queue($queue_writeable));

	return { subscribe };
};
