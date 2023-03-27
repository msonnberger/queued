import type { BrowserContext, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

import type { Database } from '$lib/types/supabase';

const supabase = createClient<Database>(process.env.PUBLIC_SUPABASE_URL ?? '', process.env.SUPABASE_SERVICE_KEY ?? '');

export function create_auth_fixture(context: BrowserContext) {
	return {
		login: async ({ premium }: { premium: boolean }) => {
			const cookies = JSON.parse(fs.readFileSync('tests/auth-cookies.json', { encoding: 'utf-8' }));
			await context.addCookies([
				{
					name: 'sb-auth-token',
					value: JSON.stringify(premium ? cookies.premium : cookies.non_premium),
					path: '/',
					domain: 'localhost'
				}
			]);
		},
		logout: async () => {
			await context.clearCookies();
		}
	};
}

export function create_queue_fixture(page: Page, auth: ReturnType<typeof create_auth_fixture>) {
	return {
		create: async () => {
			await auth.login({ premium: true });
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

			await auth.logout();

			return qid;
		},
		delete: async (qid: string) => {
			await supabase.from('queues').delete().eq('id', qid);
		},
		delete_all: async () => {
			await supabase.from('queues').delete().eq('name', 'Test Queue');
		}
	};
}
