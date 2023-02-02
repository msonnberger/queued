<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { Button } from '$lib/components';
	import { page } from '$app/stores';

	export let id: number;
	export let uri: string | undefined;
	export let title = '';
	export let artist = '';
	export let duration = 0;
	export let upvotes = 0;
	export let downvotes = 0;
	export let cover_art_url: string | undefined = undefined;

	const handle_vote = async (id: number, value: 1 | -1) => {
		await fetch('/api/queue/vote', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ supabase_id: id, value, queue_id: $page.params.id })
		});
	};
</script>

<div class="flex justify-between gap-3 m-3 bg-slate-200 dark:bg-slate-700 p-4 rounded-md">
	<div>
		<p>{title}</p>
		<p>{artist}</p>
	</div>
	<div class="flex gap-2">
		<Button on:click={() => handle_vote(id, 1)}><ThumbsUp size={16} />{upvotes}</Button>
		<Button on:click={() => handle_vote(id, -1)}><ThumbsDown size={16} />{downvotes * -1}</Button>
	</div>
</div>
