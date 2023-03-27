<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	import { invalidate } from '$app/navigation';
	import { ThemeToggle, UserMenu } from '$lib/components';

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((event) => {
			if (event !== 'SIGNED_IN') {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	export let data;
</script>

<Toaster />
<header class="self-end p-4 flex gap-5">
	<ThemeToggle />
	<UserMenu session={data.session} />
</header>
<slot />
