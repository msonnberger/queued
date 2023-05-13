// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { AuthRequest } from 'lucia-auth';

import type { Auth as LuciaAuth } from '$lib/server/lucia';

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthRequest;
			get_spotify_tokens: () => Promise<{
				access_token: string | null;
			}>;
		}

		// interface Platform {}
	}

	type CustomMatchers<R = unknown> = TestingLibraryMatchers<typeof expect.stringContaining, R>;

	namespace Vi {
		interface Assertion extends CustomMatchers {} // eslint-disable-line @typescript-eslint/no-empty-interface
		interface AsymmetricMatchersContaining extends CustomMatchers {} // eslint-disable-line @typescript-eslint/no-empty-interface
	}

	interface Window {
		onSpotifyWebPlaybackSDKReady?: () => void;
		Spotify: {
			Player: WebPlaybackPlayer;
		};
	}

	namespace Lucia {
		type Auth = LuciaAuth;
		type UserAttributes = {
			name: string | undefined;
		};
	}
}

export {};
