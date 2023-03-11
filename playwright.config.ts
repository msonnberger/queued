import { type PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config: PlaywrightTestConfig = {
	globalSetup: './tests/global-setup',
	use: {
		storageState: './tests/storage-state.json'
	},
	webServer: {
		command: 'pnpm build && pnpm preview --port 5173',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests'
};

export default config;
