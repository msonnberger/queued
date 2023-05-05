import { pg } from '@lucia-auth/adapter-postgresql';
import type { BrowserContext, Page, WorkerInfo } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import lucia, { type User } from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import fs from 'node:fs';
import postgres from 'pg';

import type { Database } from '../../src/lib/types/supabase.js';

const pool = new postgres.Pool({
	connectionString: process.env.SUPABASE_CONNECTION_STRING
});

const auth = lucia({
	adapter: pg(pool),
	env: 'DEV',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => user
});

const supabase = createClient<Database>(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_KEY ?? '');
type UserFixture = ReturnType<typeof create_user_fixture>;
type UserOpts = {
	name?: string;
	product?: 'premium' | 'free';
};

export function create_users_fixture(page: Page, context: BrowserContext, worker_info: WorkerInfo) {
	const store = { users: [], page, context } as { users: UserFixture[]; page: typeof page; context: typeof context };

	return {
		create: async (opts?: UserOpts) => {
			const id = `${opts?.name || 'user'}-${worker_info.workerIndex}-${Date.now()}`;

			const lucia_user = await auth.createUser({
				primaryKey: {
					providerId: 'playwright',
					providerUserId: id,
					password: null
				},
				attributes: {
					name: (opts?.name ?? 'Playwright') + (opts?.product ?? 'free').toUpperCase()
				}
			});

			const tokens = JSON.parse(fs.readFileSync('tests/spotify-tokens.json', { encoding: 'utf-8' }));

			let refresh_token;

			if (opts?.product === 'premium') {
				refresh_token = tokens.premium.refresh_token;
			} else {
				refresh_token = tokens.non_premium.refresh_token;
			}

			const { error } = await supabase.from('spotify_tokens').insert({
				user_id: lucia_user.id,
				refresh_token
			});

			if (error) {
				throw error;
			}

			const user_fixture = create_user_fixture(lucia_user, store.page, store.context);
			store.users.push(user_fixture);

			return user_fixture;
		},
		get: () => store.users,
		logout: async () => {
			await page.goto('/auth/logout');
		},
		delete_all: async () => {
			for (const user of store.users) {
				await auth.deleteUser(user.id);
			}

			store.users = [];
		},
		delete: async (id: string) => {
			await auth.deleteUser(id);
			store.users = store.users.filter((u) => u.id !== id);
		}
	};
}

function create_user_fixture(user: User, page: Page, context: BrowserContext) {
	const store = { user, page, context };

	// self is a reflective method that return the user object that references this fixture.
	const self = async () => await auth.getUser(store.user.id);
	return {
		id: user.id,
		name: user.name,
		self,
		login: async () => login({ ...(await self()) }, store.context),
		logout: async () => {
			await page.request.post('/auth/logout');
		},
		delete: async () => await auth.deleteUser(store.user.id)
	};
}

async function login(user: User, context: BrowserContext) {
	const session = await auth.createSession(user.id);
	const cookie = auth.createSessionCookie(session);

	await context.addCookies([
		{
			path: '/',
			domain: 'localhost',
			name: cookie.name,
			value: cookie.value
		}
	]);
}

export function create_queue_fixture(page: Page, users: ReturnType<typeof create_users_fixture>) {
	return {
		create: async () => {
			const user = await users.create({ product: 'premium' });
			await user.login();
			await page.goto('/queue/new');
			await page.locator('#queue_name').fill('Test Queue');
			await page.getByText('Create Queue').click();
			const qid = page
				.url()
				.match(/[A-Z]{7}/)
				?.at(0);

			if (!qid) {
				throw new Error('Failed to create Queue');
			}

			await user.logout();

			return qid;
		},
		add_song: async (qid: string) => {
			await supabase.from('tracks').insert([
				{ spotify_uri: 'spotify:track:0iGckQFyv6svOfAbAY9aWJ', qid: qid }
				// { spotify_uri: 'spotify:track:0V3wPSX9ygBnCm8psDIegu', qid: qid },
				// { spotify_uri: 'spotify:track:5qaEfEh1AtSdrdrByCP7qR', qid: qid }
			]);
		},
		delete: async (qid: string) => {
			await supabase.from('queues').delete().eq('id', qid);
		},
		delete_all: async () => {
			await supabase.from('queues').delete().eq('name', 'Test Queue');
		}
	};
}
