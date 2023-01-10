<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data: PageData;
	export let form: ActionData;

	$: {
		if (form?.error) {
			toast.error(form.error, { position: 'top-right' });
		}
	}
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<header class="self-end p-4">
	<Toaster />
	{#if data.session}
		<h2>Hi, {data.session.user.email}</h2>
		<form action="?/logout" method="post" use:enhance>
			<button type="submit">Logout</button>
		</form>
	{:else}
		<form action="?/login" method="post" use:enhance>
			<button type="submit">Continue with Spotify</button>
		</form>
	{/if}
</header>

<div class="grow grid place-items-center">
	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
</div>
