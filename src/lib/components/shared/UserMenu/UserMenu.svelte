<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import { Fingerprint, LogOut, User, UserCog } from 'lucide-svelte';
	import { createMenu } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	const menu = createMenu({ label: 'User Menu' });

	export let session: Session | null;
</script>

<div class="flex flex-col items-center justify-center">
	<div class="relative text-right">
		<div class="relative inline-block text-left pt-1">
			<button use:menu.button>
				<User class="stroke-slate-700 dark:stroke-slate-300" />
				<span class="sr-only">Toggle User menu</span>
			</button>

			<Transition
				show={$menu.expanded}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<div
					use:menu.items
					class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none"
				>
					<div class="px-1 py-1 w-max">
						{#if !session}
							<form use:menu.item action="/auth/login" method="post">
								<button
									type="submit"
									class="flex rounded-md items-center w-full pl-2 pr-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
								>
									<Fingerprint class="w-5 h-5 mr-3" aria-hidden="true" />
									Log in with Spotify
								</button>
							</form>
						{:else}
							<a
								use:menu.item
								class="flex rounded-md items-center w-full pl-2 pr-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
								href="/account"
							>
								<UserCog class="w-5 h-5 mr-3" aria-hidden="true" />
								{session.user.user_metadata.name}'s Account
							</a>
							<form use:menu.item action="/auth/logout" method="post">
								<button
									type="submit"
									class="flex rounded-md items-center w-full pl-2 pr-4 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
								>
									<LogOut class="w-5 h-5 mr-3" aria-hidden="true" />
									Log out
								</button>
							</form>
						{/if}
					</div>
				</div>
			</Transition>
		</div>
	</div>
</div>
