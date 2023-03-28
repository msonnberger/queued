<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	import { invalidate } from '$app/navigation';
	import { ThemeToggle, UserMenu } from '$lib/components';

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

	export let data;
</script>

<div class="flex flex-col min-h-screen">
	<Toaster />
	<header class="flex self-end p-4  gap-5">
		<ThemeToggle />
		<UserMenu session={data.session} />
	</header>
	<slot />
</div>
