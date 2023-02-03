import type { TrackObject } from './api/spotify';
import type { Database } from './api/supabase.types';

export type SupabaseQueue = Database['public']['Tables']['queues']['Row'];

export interface QueueTrack extends TrackObject {
	supabase_id: number;
	votes: { up: number; down: number; own_vote: 'up' | 'down' | null };
}

export interface QueueStore extends Pick<SupabaseQueue, 'name' | 'id'> {
	tracks: Array<QueueTrack>;
	handle_vote: (id: number, value: 1 | -1) => Promise<void>;
}

export interface PusherVoteEvent {
	supabase_track_id: number;
	up_value: number;
	down_value: number;
	type_voted: 'up' | 'down' | null;
	voter_id: string;
}
