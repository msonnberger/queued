<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { Toaster } from 'svelte-french-toast';

	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.svg';
	import { Footer, ThemeToggle, UserMenu } from '$lib/components';
	import { Logo } from '$lib/components/icons';

	inject({ mode: dev ? 'development' : 'production' });

	$: is_queue_page = $page.route.id === '/queue/[id]';

	export let data;
</script>

<Toaster />

<div class="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]">
	<header
		class="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900 flex justify-between items-center px-8 py-4"
		class:lg:ml-sidebar={is_queue_page}
	>
		<a href="/" class="w-9 h-9"><Logo /></a>
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
