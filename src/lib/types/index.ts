import type { TrackObject } from '../api/spotify';
import type { Database } from './supabase';
import type { WebPlaybackTrack } from './web-player';

export type SupabaseQueue = Database['public']['Tables']['queues']['Row'];
export type SupabaseTrack = Database['public']['Tables']['tracks']['Row'];
export type SupabaseVote = Database['public']['Tables']['votes']['Row'];

export interface QueueTrack extends TrackObject {
	supabase_id: number;
	votes: { up: number; down: number; own_vote: 'up' | 'down' | null };
}

export interface QueueStore extends Pick<SupabaseQueue, 'name' | 'id'> {
	tracks: Array<QueueTrack>;
	// TODO: add handle_vote and add_track to store and remove from components
	handle_vote: (id: number, value: 1 | -1) => void;
	remove_track: (uri: string) => void;
}

export interface PlayerStore {
	device_id: string | null;
	duration: number | null;
	position: number | null;
	track: WebPlaybackTrack | null;
	is_playing: boolean;
	volume: number;
}

export interface PusherVoteEvent {
	supabase_track_id: number;
	up_value: number;
	down_value: number;
	type_voted: 'up' | 'down' | null;
	voter_id: string;
}
