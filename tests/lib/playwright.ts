import { test as base, expect } from '@playwright/test';

import { create_auth_fixture } from './fixtures.js';

interface Fixtures {
	auth: ReturnType<typeof create_auth_fixture>;
}

const test = base.extend<Fixtures>({
	auth: async ({ context }, use) => {
		const auth_fixture = create_auth_fixture(context);
		await use(auth_fixture);
	}
});

export { test, expect };
