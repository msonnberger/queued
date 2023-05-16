<script lang="ts">
	import type { User } from 'lucia-auth';
	import toast from 'svelte-french-toast';

	import { page } from '$app/stores';
	import { ThemeToggle, UserMenu } from '$lib/components';
	import { Logo } from '$lib/components/icons';

	export let user: User | null;
	export let qid: string | undefined;
</script>

<header
	class="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 flex gap-x-4 gap-y-6 flex-wrap items-center px-5 sm:px-8 py-4"
	class:lg:ml-sidebar={$page.route.id === '/queue/[id]'}
>
	<div class="flex justify-center flex-[1] order-1">
		<a href="/" class="w-9 h-9 mr-auto"><Logo /></a>
	</div>
	{#if qid}
		<div class="flex justify-center grow order-3 xs:order-2 xs:w-auto w-full">
			<p class="text-slate-700 dark:text-slate-400 text-center">
				Share the code
				<button
					class="font-bold tracking-wide text-indigo-700 dark:text-indigo-400"
					on:click={() => {
						navigator.clipboard.writeText(qid ?? '');
						toast.success('Copied Queue code', { duration: 1250 });
					}}
				>
					{qid}
				</button>
				with your friends!
			</p>
		</div>
	{/if}
	<div class="flex justify-center flex-[1] gap-5 order-2 sm:order-3">
		<span class="ml-auto">
			<ThemeToggle />
		</span>
		{#if $page.route.id !== '/waitlist'}
			<UserMenu {user} />
		{/if}
	</div>
</header>
