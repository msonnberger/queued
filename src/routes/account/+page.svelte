<script lang="ts">
	import { Trash2 } from 'lucide-svelte';

	import { enhance } from '$app/forms';
	import { Button } from '$lib/components';

	export let data;
</script>

<svelte:head>
	<title>Queued • Account</title>
</svelte:head>

<main class="max-w-2xl w-full mt-10 px-4 lg:px-0">
	<h1 class="text-6xl font-bold mb-20 mt-4">My Account</h1>

	<h2 class="text-xl font-bold mb-4">Queues</h2>

	{#if data.queues.length > 0}
		<ul class="max-w-sm flex flex-col gap-3">
			{#each data.queues as queue}
				<li class="flex justify-between items-center bg-slate-50 dark:bg-slate-800 py-2 pl-4 pr-2 rounded-lg shadow-sm">
					<a href="/queue/{queue.id}" class="hover:underline">
						{queue.name}
					</a>
					<form action="?/delete_queue" method="post" use:enhance>
						<input type="hidden" name="qid" value={queue.id} />
						<button type="submit" class="block hover:bg-slate-100 transition-colors p-2 rounded-lg"><Trash2 /></button>
					</form>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mb-3">You have no Queues yet.</p>
		<Button href="/queue/new">Create Queue</Button>
	{/if}

	<h2 class="text-xl font-bold mt-10 mb-4">Danger Zone</h2>

	<form action="?/delete_account" method="post" class="flex gap-5 items-center flex-wrap">
		<Button type="submit" variant="danger"><span>Delete account</span></Button>
		<p class="italic text-red-500 text-sm">This action is irreversible.</p>
	</form>
</main>
