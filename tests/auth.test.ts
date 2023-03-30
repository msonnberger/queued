import { expect, test } from './lib/playwright.js';

test('login works', async ({ page, auth }) => {
	await auth.login({ premium: false });
	await page.goto('/');
	await page.getByText('Toggle User menu').click();
	await expect(page.getByText(process.env.TEST_NAME + "'s Account")).toBeVisible();
});

test('logout works', async ({ page, auth }) => {
	await auth.login({ premium: false });
	await page.goto('/');
	const user_menu_toggle = await page.getByText('Toggle User menu');
	await user_menu_toggle.click();
	await page.getByText('Log out').click();
	await user_menu_toggle.click();
	await expect(page.getByText('Log in with Spotify')).toBeVisible();
});
