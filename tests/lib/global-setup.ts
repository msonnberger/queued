import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const global_setup = async () => {
	const { access_token, refresh_token } = await get_supabase_tokens();
	const spotify_access_token_non_premium = await get_spotify_access_token({
		refresh_token: process.env.TEST_SPOTIFY_REFRESH_TOKEN ?? ''
	});

	const spotify_access_token_premium = await get_spotify_access_token({
		refresh_token: process.env.TEST_SPOTIFY_PREMIUM_REFRESH_TOKEN ?? ''
	});

	const cookies = {
		non_premium: [
			access_token,
			refresh_token,
			spotify_access_token_non_premium,
			process.env.TEST_SPOTIFY_REFRESH_TOKEN
		],
		premium: [access_token, refresh_token, spotify_access_token_premium, process.env.TEST_SPOTIFY_PREMIUM_REFRESH_TOKEN]
	};

	fs.writeFileSync('tests/auth-cookies.json', JSON.stringify(cookies), { encoding: 'utf-8' });
};

const get_supabase_tokens = async () => {
	const supabase = createClient(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.PUBLIC_SUPABASE_ANON_KEY ?? '');

	const { data, error } = await supabase.auth.signInWithPassword({
		email: process.env.TEST_EMAIL ?? '',
		password: process.env.TEST_PASSWORD ?? ''
	});

	if (error) {
		throw error;
	}

	if (!data.session) {
		throw new Error('No session returned from Supabase');
	}

	const { access_token, refresh_token } = data.session;

	return { access_token, refresh_token };
};

const get_spotify_access_token = async ({ refresh_token }: { refresh_token: string }) => {
	const res = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
			).toString('base64')}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token
		})
	});

	const data = await res.json();
	return data.access_token;
};

export default global_setup;
