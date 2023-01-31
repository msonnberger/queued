import { readable } from 'svelte/store';
import type { Database } from './api/supabase.types';

type Queue = Database['public']['Tables']['queues']['Row'];

export const createQueueStore = (queue: Queue) => {
	return readable({ name: queue.name });
};
