<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { supabase } from '$lib/api/supabase';
	import { Button, ThemeToggle } from '$lib/components';
	import { onMount } from 'svelte';
	import '../app.css';
	import type { PageData } from './$types';

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => data.subscription.unsubscribe();
	});

	export let data: PageData;
</script>

<header class="self-end p-4 flex gap-5">
	<Button href="/">Home</Button>
	<ThemeToggle />
	{#if data.session}
		<h2>Hi, {data.session.user.email}</h2>
		<form action="/auth/logout" method="post">
			<Button type="submit">Logout</Button>
		</form>
	{:else}
		<form action="/auth/login" method="post">
			<Button type="submit">Continue with Spotify</Button>
		</form>
	{/if}
</header>
<slot />
