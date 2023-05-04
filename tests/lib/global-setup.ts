import fs from 'node:fs';

const global_setup = async () => {
	const spotify_access_token_non_premium = await get_spotify_access_token({
		refresh_token: process.env.TEST_SPOTIFY_REFRESH_TOKEN ?? ''
	});

	const spotify_access_token_premium = await get_spotify_access_token({
		refresh_token: process.env.TEST_SPOTIFY_PREMIUM_REFRESH_TOKEN ?? ''
	});

	const cookies = {
		non_premium: {
			access_token: spotify_access_token_non_premium,
			refresh_token: process.env.TEST_SPOTIFY_REFRESH_TOKEN
		},
		premium: {
			access_token: spotify_access_token_premium,
			refresh_token: process.env.TEST_SPOTIFY_PREMIUM_REFRESH_TOKEN
		}
	};

	fs.writeFileSync('tests/spotify-tokens.json', JSON.stringify(cookies), { encoding: 'utf-8' });
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
