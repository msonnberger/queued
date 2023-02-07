import { derived, writable } from 'svelte/store';
import { pusher_client } from './api/pusher/client';
import type { PusherVoteEvent, QueueStore, QueueTrack } from './types';
import { sorted_queue } from './utils';

export const createQueueStore = (initial_value: Omit<QueueStore, 'handle_vote'>, current_voter_id: string) => {
	const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

	channel.bind('track-added', (data: Omit<QueueTrack, 'votes'>) => {
		const new_track = { ...data, votes: { up: 0, down: 0, own_vote: null } };
		queue_writable.update((value) => ({ ...value, tracks: [...value.tracks, new_track] }));
	});

	channel.bind('vote', (data: PusherVoteEvent) => {
		console.log(data);
		queue_writable.update((value) => {
			const track_index = value.tracks.findIndex((track) => track.supabase_id === data.supabase_track_id);

			if (track_index === undefined) {
				return value;
			}

			value.tracks[track_index].votes.up += data.up_value;
			value.tracks[track_index].votes.down += data.down_value;

			if (current_voter_id === data.voter_id) {
				value.tracks[track_index].votes.own_vote = data.type_voted;
			}

			return value;
		});
	});

	const queue_writable = writable<QueueStore>(initial_value as QueueStore);

	const { subscribe } = derived(queue_writable, ($queue_writeable) => sorted_queue($queue_writeable));

	return {
		subscribe,
		handle_vote: async (id: number, value: 1 | -1) => {
			await fetch('/api/queue/vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ supabase_id: id, value, queue_id: initial_value.id })
			});
		}
	};
};
