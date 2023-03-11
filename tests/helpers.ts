import type { BrowserContext } from '@playwright/test';
import fs from 'node:fs';

export const auth = {
	login: async (context: BrowserContext, { premium }: { premium: boolean }) => {
		const cookies = JSON.parse(fs.readFileSync('tests/auth-cookies.json', { encoding: 'utf-8' }));
		await context.addCookies([
			{
				name: 'sb-auth-token',
				value: JSON.stringify(premium ? cookies.premium : cookies.non_premium),
				path: '/',
				domain: 'localhost'
			}
		]);
	}
};
