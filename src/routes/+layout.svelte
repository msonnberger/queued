<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';

	import { page } from '$app/stores';
	import { Footer, ThemeToggle, UserMenu } from '$lib/components';

	$: is_queue_page = $page.route.id === '/queue/[id]';

	export let data;
</script>

<Toaster />

<div class="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]">
	<header
		class="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 flex justify-between items-center px-8 py-4"
		class:lg:ml-sidebar={is_queue_page}
	>
		<a href="/" class="font-extrabold text-3xl text-slate-700 dark:text-slate-300">Q</a>
		<div class="flex gap-5">
			<ThemeToggle />
			{#if $page.route.id !== '/waitlist'}
				<UserMenu user={data.user} />
			{/if}
		</div>
	</header>

	<div class="flex-1 flex flex-col {is_queue_page ? 'items-stretch' : 'items-center'}">
		<slot />
	</div>

	{#if !is_queue_page}
		<Footer />
	{/if}
</div>
