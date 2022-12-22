import { expect, type Page } from '@playwright/test';

export const login = async (page: Page) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Continue with Spotify' }).click();
	await expect(page).toHaveURL(/.*spotify.com.*/);

	await page.getByTestId('login-username').fill(process.env.SPOTIFY_USER as string);
	await page.getByTestId('login-password').fill(process.env.SPOTIFY_PASSWORD as string);
	await page.waitForTimeout(500);
	await page.getByTestId('login-button').click();
};
