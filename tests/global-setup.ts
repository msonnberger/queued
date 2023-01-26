import { chromium } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const global_setup = async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	const { access_token, refresh_token } = await get_supabase_tokens();
	const spotify_access_token = await get_spotify_access_token();

	page.context().addCookies([
		{
			name: 'supabase-auth-token',
			value: JSON.stringify([
				access_token,
				refresh_token,
				spotify_access_token,
				process.env.TEST_SPOTIFY_REFRESH_TOKEN
			]),
			path: '/',
			domain: 'localhost'
		}
	]);
	// save cookies to reuse across tests
	await page.context().storageState({ path: './tests/storage-state.json' });
	await browser.close();
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

const get_spotify_access_token = async () => {
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
			refresh_token: process.env.TEST_SPOTIFY_REFRESH_TOKEN ?? ''
		})
	});

	const data = await res.json();
	return data.access_token;
};

export default global_setup;
