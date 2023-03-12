import { expect, test } from './lib/playwright.js';

test.beforeEach(async ({ page }) => await page.goto('/'));

test('landing page has expected h1', async ({ page }) => {
	await expect(page.getByText('Meet Queued, your collaborative DJ.')).toBeVisible();
});

test('landing page has expected links', async ({ page }) => {
	await expect(page.getByText('Create Queue')).toHaveAttribute('href', '/queue/new');
	await expect(page.getByText('Privacy')).toHaveAttribute('href', '/privacy');
	await expect(page.getByText('Imprint')).toHaveAttribute('href', '/imprint');
	await expect(page.locator('a', { hasText: 'GitHub Repository' })).toHaveAttribute(
		'href',
		'https://github.com/msonnberger/queued'
	);
});

test.describe.only('dark mode', () => {
	test('default to light mode with no preference', async ({ page }) => {
		await expect(page.locator('html')).not.toHaveClass('dark');
	});

	test('listen to system changes per default', async ({ page }) => {
		await expect(page.locator('html')).not.toHaveClass('dark');
		await page.emulateMedia({ colorScheme: 'dark' });
		await page.waitForTimeout(500);
		await expect(page.locator('html')).toHaveClass('dark');
		await page.emulateMedia({ colorScheme: 'light' });
		await expect(page.locator('html')).not.toHaveClass('dark');
	});

	test('manually select light mode', async ({ page }) => {
		await page.getByText('Toggle Theme menu').click();
		await page.getByText('Light').click();
		await expect(page.locator('html')).not.toHaveClass('dark');
		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(page.locator('html')).not.toHaveClass('dark');
	});

	test('manually select dark mode', async ({ page }) => {
		await page.getByText('Toggle Theme menu').click();
		await page.getByText('Dark').click();
		await expect(page.locator('html')).toHaveClass('dark');
		await page.emulateMedia({ colorScheme: 'light' });
		await expect(page.locator('html')).toHaveClass('dark');
	});

	test('manually select system mode', async ({ page }) => {
		await page.getByText('Toggle Theme menu').click();
		await page.getByText('System').click();
		await expect(page.locator('html')).not.toHaveClass('dark');
		await page.emulateMedia({ colorScheme: 'dark' });
		await expect(page.locator('html')).toHaveClass('dark');
	});
});
