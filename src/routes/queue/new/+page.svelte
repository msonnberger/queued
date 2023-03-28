<script lang="ts">
	import { Edit2 } from 'lucide-svelte';

	import { Button } from '$lib/components';
	import { JoinQueue } from '$lib/components/landing-page';

	export let data;
</script>

<main class="w-full max-w-2xl pt-10">
	{#if data.user_has_premium}
		<h1 class="text-2xl mb-5">What should we name your Queue?</h1>

		<form action="?/create_queue" method="post" class="flex flex-col items-start gap-5">
			<div class="flex items-center mb-12">
				<input
					type="text"
					name="queue_name"
					id="queue_name"
					class="text-5xl font-bold bg-slate-100 dark:bg-slate-900"
					value="{data.user_name}'s Queue"
					autocomplete="off"
				/>
				<label for="queue_name" class="cursor-pointer"><Edit2 size={32} strokeWidth={2.5} /></label>
			</div>

			<Button type="submit">Create Queue</Button>
		</form>
	{:else}
		<h1 class="text-4xl font-bold mb-10">Spotify Premium required</h1>
		<p class="mb-10 text-xl">
			To create a Queue, you need a Spotify Premium account. You can however join another Queue or go back home.
		</p>
		<div class="flex gap-3">
			<Button size="lg" href="/">Home</Button>
			<JoinQueue />
		</div>
	{/if}
</main>
