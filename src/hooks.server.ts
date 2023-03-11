import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export const handle = (async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const { data } = await event.locals.supabase.auth.getSession();
		return data.session;
	};

	return resolve(event, {
		// Supabase needs the content-range header
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}) satisfies Handle;
