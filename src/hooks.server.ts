import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

export async function handle({ event, resolve }) {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.supabase_admin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);

	event.locals.get_session = async () => {
		const { data } = await event.locals.supabase.auth.getSession();
		return data.session;
	};

	return resolve(event, {
		// Supabase needs the content-range header
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}
