<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<slot />
