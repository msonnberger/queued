import { pg } from '@lucia-auth/adapter-postgresql';
import { provider } from '@lucia-auth/oauth';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';

import { LUCIA_URL, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { getMe } from '$lib/api/spotify';
import { connection_pool } from './db/db';

export const auth = lucia({
	adapter: pg(connection_pool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => user
});

export type Auth = typeof auth;

export const spotify_auth = provider(auth, {
	providerId: 'spotify',
	getAuthorizationUrl: async (state) => {
		const url =
			'https://accounts.spotify.com/authorize?' +
			new URLSearchParams({
				client_id: SPOTIFY_CLIENT_ID,
				client_secret: SPOTIFY_CLIENT_SECRET,
				redirect_uri: new URL('/auth/callback', LUCIA_URL).href,
				response_type: 'code',
				state: state,
				scope:
					'user-read-private user-read-playback-state user-modify-playback-state user-read-currently-playing streaming'
			}).toString();

		return new URL(url);
	},
	getTokens: async (code) => {
		const res = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: new URL('/auth/callback', LUCIA_URL).href
			}),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
			}
		});

		const tokens = (await res.json()) as {
			access_token: string;
			refresh_token: string;
			expires_in: number;
			token_type: string;
			scope: string;
		};

		return { accessToken: tokens.access_token, refreshToken: tokens.refresh_token };
	},
	getProviderUser: async (access_token) => {
		const user = await getMe({
			headers: { Authorization: `Bearer ${access_token}` }
		});
		return [user.id as string, user];
	}
});
