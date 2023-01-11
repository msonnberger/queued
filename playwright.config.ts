import dotenv from 'dotenv';
import { type PlaywrightTestConfig, devices } from '@playwright/test';

dotenv.config({ path: './tests/.env' });

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm build && pnpm preview --port 5173',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		}
	]
};

export default config;
