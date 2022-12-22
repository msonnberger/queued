import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

test.describe('authentication with spotify', () => {
	test('login with spotify works', async ({ page }) => {
		await login(page);
		await expect(page.getByText(`Hi, ${process.env.SPOTIFY_USER}`)).toBeVisible();
	});

	test('logout works', async ({ page }) => {
		await login(page);
		await page.getByRole('button', { name: 'Logout' }).click();
		await expect(page.getByText('Continue with Spotify')).toBeVisible();
	});
});
