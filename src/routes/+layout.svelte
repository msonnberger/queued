<script lang="ts">
	import '../app.css';
	import { inject } from '@vercel/analytics';
	import { Toaster } from 'svelte-french-toast';

	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { Footer, Header } from '$lib/components';

	inject({ mode: dev ? 'development' : 'production' });

	$: is_queue_page = $page.route.id === '/queue/[id]' && !$page.error;

	export let data;
</script>

<Toaster />

<div class="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]">
	<Header user={data.user} qid={data.qid} {is_queue_page} />

	<div class="flex-1 flex flex-col {is_queue_page ? 'items-stretch' : 'items-center'}">
		<slot />
	</div>

	{#if !is_queue_page}
		<Footer />
	{/if}
</div>
