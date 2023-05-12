import { expect, test } from './lib/playwright.js';

test.afterEach(async ({ users }) => await users.delete_all());

test('login works', async ({ page, users }) => {
	const user = await users.create();
	await user.login();
	await page.goto('/');
	await page.getByText('Toggle User menu').click();
	await expect(page.getByText(user.name + "'s Account")).toBeVisible();
});

test('logout works', async ({ page, users }) => {
	const user = await users.create();
	await user.login();
	await page.goto('/');
	const user_menu_toggle = await page.getByText('Toggle User menu');
	await user_menu_toggle.click();
	await page.getByText('Log out').click();
	await user_menu_toggle.click();
	await expect(page.getByText('Log in with Spotify')).toBeVisible();
});
