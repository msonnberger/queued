// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// and what to do when importing types
declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			supabase: TypedSupabaseClient;
			session: Session | null;
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
}
