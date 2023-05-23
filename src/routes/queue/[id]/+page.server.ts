import { error } from '@sveltejs/kit';

import type { TrackObject } from '$lib/api/spotify';
import { db } from '$lib/server/db/db';
import type { Queue as StoreQueue } from '$lib/types';

export async function load({ cookies, locals, params, fetch }) {
	if (cookies.get('voter-id') === undefined) {
		cookies.set('voter-id', crypto.randomUUID(), { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	const voter_id = cookies.get('voter-id') as string;

	const { access_token } = await locals.get_spotify_tokens();

	const queue = await db.query.queues.findFirst({
		with: {
			tracks: {
				with: {
					votes: true
				}
			}
		},
		where: (queues, { eq }) => eq(queues.id, params.id)
	});

	if (queue === undefined) {
		throw error(404, 'This Queue does not exist.');
	}

	const currently_playing_id = queue.current_track_uri?.split(':').at(-1);
	let spotify_track_ids = queue.tracks.map((track) => track.spotify_uri.split(':').at(-1)).join(',');

	if (currently_playing_id) {
		spotify_track_ids = spotify_track_ids ? `${currently_playing_id},${spotify_track_ids}` : currently_playing_id;
	}

	const store_queue: StoreQueue = {
		name: queue.name,
		id: queue.id,
		owner_id: queue.owner_id,
		tracks: []
	};
	let currently_playing_track: TrackObject | undefined;

	if (spotify_track_ids) {
		const spotify_tracks_response = await fetch(`/api/get-tracks?track_ids=${spotify_track_ids}`);
		let spotify_tracks = (await spotify_tracks_response.json()) as TrackObject[];

		if (currently_playing_id) {
			currently_playing_track = spotify_tracks[0];
			spotify_tracks = spotify_tracks.slice(1);
		}

		store_queue.tracks =
			queue.tracks.map((db_track, i) => {
				const votes = db_track.votes;
				return {
					...spotify_tracks[i],
					db_id: db_track.id,
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
						own_vote: votes.some((vote) => vote.value > 0 && vote.voter_id === voter_id)
							? 'up'
							: votes.some((vote) => vote.value < 0 && vote.voter_id === voter_id)
							? 'down'
							: null
					}
				};
			}) ?? [];
	}

	store_queue.currently_playing = currently_playing_track;

	return {
		store_queue,
		access_token,
		voter_id
	};
}
