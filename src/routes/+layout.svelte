<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const { data } = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
