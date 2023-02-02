import type { TrackObject } from './api/spotify';
import type { Database } from './api/supabase.types';

export type SupabaseQueue = Database['public']['Tables']['queues']['Row'];

export interface QueueTrack extends TrackObject {
	supabase_id: number;
	votes: { up: number; down: number };
}

export interface QueueStore extends Pick<SupabaseQueue, 'name' | 'id'> {
	tracks: Array<QueueTrack>;
}
