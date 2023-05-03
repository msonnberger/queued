// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { AuthRequest } from 'lucia-auth';

import type { Auth as LuciaAuth } from '$lib/server/lucia';
import type { Database } from '$lib/types/supabase';

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			supabase_admin: SupabaseClient<Database>;
			auth: AuthRequest;
			get_spotify_tokens: () => Promise<{
				access_token: string | null;
				refresh_token: string | null;
				expires_in: number | null;
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
