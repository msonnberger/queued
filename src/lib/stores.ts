import { derived, writable } from 'svelte/store';

import { pusher_client } from './api/pusher/client';
import type { TrackObject } from './api/spotify';
import type {
	PlayerStore,
	PusherAddTrackEvent,
	PusherDeleteTrackEvent,
	PusherVoteEvent,
	Queue,
	QueueStore
} from './types';
import { sorted_queue } from './utils';

export const create_queue_store = (initial_value: Queue, current_voter_id: string): QueueStore => {
	const qid = initial_value.id;

	const queue_writable = writable<Queue>(initial_value, () => {
		const channel = pusher_client.subscribe(`queue-${qid}`);

		channel.bind('track-added', (data: PusherAddTrackEvent) => {
			const new_track = { ...data, votes: { up: 0, down: 0, own_vote: null } };
			queue_writable.update((value) => ({ ...value, tracks: [...value.tracks, new_track] }));
		});

		channel.bind('track-removed', (data: PusherDeleteTrackEvent) => {
			queue_writable.update((old) => ({
				...old,
				tracks: old.tracks.filter((track) => track.uri !== data.uri)
			}));
		});

		channel.bind('current-track-updated', (data: TrackObject) => {
			queue_writable.update((old) => ({
				...old,
				currently_playing: data
			}));
		});

		channel.bind('vote', (data: PusherVoteEvent) => {
			queue_writable.update((value) => {
				const track_index = value.tracks.findIndex((track) => track.db_id === data.db_track_id);

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

		return () => channel.unbind_all();
	});

	const { subscribe } = derived(queue_writable, ($queue_writeable) => sorted_queue($queue_writeable));

	return {
		subscribe,
		add_track: async (track: TrackObject) => {
			return fetch(`/api/queue/${qid}/track`, {
				method: 'POST',
				body: JSON.stringify({ track })
			});
		},
		delete_track: async (uri: string) => {
			return fetch(`/api/queue/${qid}/track`, {
				method: 'DELETE',
				body: JSON.stringify({ uri })
			});
		},
		add_vote: async (track_id: number, value: 1 | -1, is_vote_flipped: boolean) => {
			return fetch(`/api/queue/${qid}/vote`, {
				method: 'POST',
				body: JSON.stringify({ db_track_id: track_id, value, is_vote_flipped })
			});
		},
		delete_vote: async (track_id: number) => {
			return fetch(`/api/queue/${qid}/vote`, {
				method: 'DELETE',
				body: JSON.stringify({ db_track_id: track_id })
			});
		},
		update_current_track: async (uri: string | null) => {
			return fetch(`/api/queue/${qid}/update-current-track`, {
				method: 'POST',
				body: JSON.stringify({ uri })
			});
		}
	};
};

export const create_player_store = () =>
	writable<PlayerStore>({
		device_id: null,
		duration: null,
		position: null,
		track: null,
		up_next_uri: null,
		is_playing: false,
		volume: 1
	});

export const add_track_store = writable<{ track: TrackObject | null; delete_track?: QueueStore['delete_track'] }>({
	track: null
});
