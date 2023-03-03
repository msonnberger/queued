import { derived, writable } from 'svelte/store';
import type { PlayerStore, PusherVoteEvent, QueueStore, QueueTrack } from './types';
import { sorted_queue } from './utils';
import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher-js';
import type { TrackObject } from './api/spotify';

const pusher_client = new Pusher(PUBLIC_PUSHER_KEY, {
	cluster: PUBLIC_PUSHER_CLUSTER,
	wsHost: 'ws.queued.live',
	wsPort: 80,
	wssPort: 443,
	enabledTransports: ['ws', 'wss'],
	forceTLS: true
});

export const create_queue_store = (initial_value: Partial<QueueStore>, current_voter_id: string) => {
	initial_value.remove_track = (uri: string) => {
		fetch('/api/queue/remove-track', {
			method: 'DELETE',
			body: JSON.stringify({ uri, queue_id: initial_value.id })
		});
	};

	initial_value.update_current_track = (uri: string) => {
		fetch('/api/queue/update-current-track', {
			method: 'POST',
			body: JSON.stringify({ uri, qid: initial_value.id })
		});
	};

	const queue_writable = writable<QueueStore>(initial_value as QueueStore, () => {
		const channel = pusher_client.subscribe(`queue-${initial_value.id}`);

		channel.bind('track-added', (data: Omit<QueueTrack, 'votes'>) => {
			const new_track = { ...data, votes: { up: 0, down: 0, own_vote: null } };
			queue_writable.update((value) => ({ ...value, tracks: [...value.tracks, new_track] }));
		});

		channel.bind('track-removed', (data: { uri: string }) => {
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

		return () => channel.unbind_all();
	});

	return derived(queue_writable, ($queue_writeable) => sorted_queue($queue_writeable));
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

export const spotify_tokens = writable<{ access_token: string | null; refresh_token: string | null }>({
	access_token: null,
	refresh_token: null
});
