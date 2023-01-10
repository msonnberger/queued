import { test, expect } from '@playwright/test';

test.describe('authentication with spotify', () => {
	test.skip('login with spotify works', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText(`Hi, ${process.env.SPOTIFY_USER}`)).toBeVisible();
	});

	test.skip('logout works', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Logout' }).click();
		await expect(page.getByText('Continue with Spotify')).toBeVisible();
	});
});
