<script lang="ts">
	import type { PageData } from './$types';
	import { supabaseClient } from '$lib/supabase';

	export let data: PageData;
</script>

<header class="self-end p-4">
	{#if data.session}
		<h2>Hi, {data.session.user.email}</h2>
		<button on:click={() => supabaseClient.auth.signOut()}>Logout</button>
	{:else}
		<button on:click={() => supabaseClient.auth.signInWithOAuth({ provider: 'spotify' })}>Continue with Spotify</button>
	{/if}
</header>

<div class="grow grid place-items-center">
	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
</div>
