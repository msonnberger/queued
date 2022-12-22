<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<header class="self-end p-4">
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
	{#if form?.message}
		<p>{form.message}</p>
	{/if}

	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
</div>
