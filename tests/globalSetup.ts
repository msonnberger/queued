import { chromium, expect } from '@playwright/test';

const globalSetup = async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto('http://localhost:5173/');
	await page.getByRole('button', { name: 'Continue with Spotify' }).click();
	await expect(page).toHaveURL(/.*spotify.com.*/);
	await page.getByTestId('login-username').fill(process.env.SPOTIFY_USER as string);
	await page.getByTestId('login-password').fill(process.env.SPOTIFY_PASSWORD as string);
	await page.waitForTimeout(1000);
	await page.getByTestId('login-button').click();
	await page.waitForLoadState('networkidle');
	// save cookies to reuse across tests
	await page.context().storageState({ path: './tests/storageState.json' });
	await browser.close();
};

export default globalSetup;
