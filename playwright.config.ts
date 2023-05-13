import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = defineConfig({
	globalSetup: './tests/lib/global-setup',
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173,
		reuseExistingServer: false
	},
	testDir: 'tests'
});

export default config;
