import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { createQueueStore } from '$lib/stores';

export const load = (async (event) => {
	const { params } = event;
	const { supabaseClient } = await getSupabase(event);

	const { data, error: err } = await supabaseClient.from('queues').select().eq('id', params.id).single();

	if (err || !data) {
		throw error(404, 'This Queue does not exist.');
	}

	return {
		queue: createQueueStore(data)
	};
}) satisfies PageLoad;
