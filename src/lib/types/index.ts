import type { InferModel } from 'drizzle-orm';
import type { Readable } from 'svelte/store';

import type { queues } from '$lib/server/db/schema';
import type { TrackObject } from '../api/spotify';
import type { WebPlaybackTrack } from './web-player';

export interface QueueTrack extends TrackObject {
	db_id: number;
	votes: { up: number; down: number; own_vote: 'up' | 'down' | null };
}

type DbQueue = InferModel<typeof queues>;

export interface Queue extends Pick<DbQueue, 'name' | 'id' | 'owner_id'> {
	tracks: Array<QueueTrack>;
	currently_playing?: TrackObject;
}

export interface QueueStore extends Readable<Queue> {
	add_track: (track: TrackObject) => Promise<Response>;
	delete_track: (uri: string) => Promise<Response>;
	add_vote: (id: number, value: 1 | -1, is_vote_flipped: boolean) => Promise<Response>;
	delete_vote: (track_id: number) => Promise<Response>;
	update_current_track: (uri: string | null) => Promise<Response>;
}

export interface PlayerStore {
	device_id: string | null;
	duration: number | null;
	position: number | null;
	track: WebPlaybackTrack | null;
	up_next_uri: string | null;
	is_playing: boolean;
	volume: number;
}

export interface PusherVoteEvent {
	db_track_id: number;
	up_value: number;
	down_value: number;
	type_voted: 'up' | 'down' | null;
	voter_id: string;
}

export type PusherAddTrackEvent = Omit<QueueTrack, 'votes'>;

export interface PusherDeleteTrackEvent {
	uri: string;
}
