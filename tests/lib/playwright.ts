import { test as base, expect } from '@playwright/test';

import { create_queue_fixture, create_users_fixture } from './fixtures.js';

interface Fixtures {
	users: ReturnType<typeof create_users_fixture>;
	queue: ReturnType<typeof create_queue_fixture>;
}

const test = base.extend<Fixtures>({
	users: async ({ context, page }, use, workerInfo) => {
		const users_fixture = create_users_fixture(page, context, workerInfo);
		await use(users_fixture);
	},
	queue: async ({ page, users }, use) => {
		const queue_fixture = create_queue_fixture(page, users);
		await use(queue_fixture);
	}
});

export { test, expect };
