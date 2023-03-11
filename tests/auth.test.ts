import { expect, test } from '@playwright/test';

import { auth } from './helpers.js';

test('login works', async ({ page, context }) => {
	await auth.login(context, { premium: false });
	await page.goto('/');
	await page.getByText('Toggle User menu').click();
	await expect(page.getByText(process.env.TEST_NAME + "'s Account")).toBeVisible();
});

test('logout works', async ({ page, context }) => {
	await auth.login(context, { premium: false });
	await page.goto('/');
	const user_menu_toggle = await page.getByText('Toggle User menu');
	await user_menu_toggle.click();
	await page.getByText('Log out').click();
	await user_menu_toggle.click();
	await expect(page.getByText('Log in with Spotify')).toBeVisible();
});
