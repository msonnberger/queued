<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { Footer, ThemeToggle, UserMenu } from '$lib/components';

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	$: is_queue_page = $page.route.id === '/queue/[id]';

	export let data;
</script>

<Toaster />

<div class="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]">
	<header class="flex justify-between items-center px-8 py-4" class:lg:ml-sidebar={is_queue_page}>
		<a href="/" class="font-extrabold text-3xl">Q</a>
		<div class="flex gap-5">
			<ThemeToggle />
			<UserMenu session={data.session} />
		</div>
	</header>

	<div class="flex-1 flex flex-col {is_queue_page ? 'items-stretch' : 'items-center'}">
		<slot />
	</div>

	{#if !is_queue_page}
		<Footer />
	{/if}
</div>
