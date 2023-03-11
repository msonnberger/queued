import { expect, test } from '@playwright/test';

test.describe('authentication with spotify', () => {
	test('login works', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Hi')).toBeVisible();
	});

	test('logout works', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Logout' }).click();
		await expect(page.getByText('Continue with Spotify')).toBeVisible();
	});
});
