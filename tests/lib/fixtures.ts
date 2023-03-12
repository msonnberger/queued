import type { BrowserContext } from '@playwright/test';
import fs from 'node:fs';

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
