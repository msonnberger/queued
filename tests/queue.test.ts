import { expect, test } from './lib/playwright.js';

test.afterEach(({ users }) => users.delete_all());

test.describe('create and join Queue', () => {
	test('logged out user sees login button', async ({ page }) => {
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page).toHaveURL(/.*login/);
		await expect(page.getByText('Continue with Spotify')).toBeVisible();
	});

	test('non-premium user sees hint for premium', async ({ page, users }) => {
		const user = await users.create({ product: 'free' });
		await user.login();
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page).not.toHaveURL(/.*login/);
		await expect(page.getByText('Spotify Premium required')).toBeVisible();
	});

	test('premium user can create Queue', async ({ page, users, queue }) => {
		const user = await users.create({ product: 'premium' });
		await user.login();
		await page.goto('/');
		await page.getByText('Create Queue').click();
		await expect(page.locator('#queue_name')).toBeVisible();
		await page.locator('#queue_name').fill('Test Queue');
		await page.getByText('Create Queue').click();
		await expect(page.getByText('Test Queue')).toBeVisible();
		await expect(page).toHaveURL(/.*queue\/[A-Z]{7}/);
		const qid = page
			.url()
			.match(/[A-Z]{7}/)
			?.at(0);
		await expect(qid).toBeDefined();
		await queue.delete(qid as string);
	});

	test('all users can join queue', async ({ page, queue }) => {
		const qid = await queue.create();
		await page.goto('/');
		await page.reload();
		await page.getByText('Join Queue').click();
		await page.locator('#qid').fill(qid);
		await page.getByTestId('join-queue-arrow').click();
		await page.waitForLoadState('networkidle');
		await expect(page.url()).toContain(qid);
		await expect(page.getByText('Test Queue')).toBeVisible();
		await queue.delete(qid);
	});
});

test.describe('Queue functionality', () => {
	test.skip('add track', async ({ page, queue }) => {
		const qid = await queue.create();
		await page.goto(`/queue/${qid}`);
		await page.getByPlaceholder('Search Songs').fill('Umbrella Rihanna');
		//await page.waitForLoadState('networkidle');
		await page.getByTestId('add-track-button');
		//await page.waitForLoadState('networkidle');
		await expect(page.getByTestId('track-item').getByText('Umbrella')).toBeVisible();
		await queue.delete(qid);
	});

	test('upvote track', async ({ page, queue }) => {
		const qid = await queue.create();
		await queue.add_song(qid);

		await page.goto(`/queue/${qid}`);
		await page.waitForTimeout(1000);

		await page.getByTestId('track-item-0').getByTestId('upvote').click();
		await page.waitForTimeout(1000);

		const value = await page.getByTestId('track-item-0').getByTestId('upvote').getByTestId('vote-value').innerText();
		await expect(value).toEqual('1');
		await queue.delete(qid);
	});

	test('downvote track', async ({ page, queue }) => {
		const qid = await queue.create();
		await queue.add_song(qid);

		await page.goto(`/queue/${qid}`);
		await page.waitForTimeout(1000);

		await page.getByTestId('track-item-0').getByTestId('downvote').click();
		await page.waitForTimeout(1000);

		const value = await page.getByTestId('track-item-0').getByTestId('downvote').getByTestId('vote-value').innerText();
		await expect(value).toEqual('1');
		await queue.delete(qid);
	});
});
