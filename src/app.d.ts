// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { Database } from '$lib/types/supabase';
import type { WebPlaybackPlayer } from '/types/web-player';

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
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
}
