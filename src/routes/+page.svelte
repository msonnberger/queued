<script lang="ts">
	import { ThemeToggle } from '$lib/components';

	export let data: PageData;
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<header class="self-end p-4">
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

<div class="grow grid place-items-center">
	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
	<Button href="/queue/new">Create Queue</Button>
</div>
