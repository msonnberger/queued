<script lang="ts">
	import { ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import { VoteButton } from '$lib/components/queue';
	import { page } from '$app/stores';

	export let id: number;
	export let uri: string | undefined;
	export let title = '';
	export let artist = '';
	export let duration = 0;
	export let upvotes = 0;
	export let downvotes = 0;
	export let cover_art_url: string | undefined = undefined;
	export let has_upvoted = false;
	export let has_downvoted = false;

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

<div class="flex justify-between gap-3 bg-slate-200 dark:bg-slate-700 p-4 rounded-md shadow-md">
	<div>
		<p class="font-bold">{title}</p>
		<p>{artist}</p>
	</div>
	<div class="flex gap-2">
		<VoteButton on:click={() => handle_vote(id, 1)} vote_type="up" value={upvotes} has_voted={has_upvoted} />
		<VoteButton on:click={() => handle_vote(id, -1)} vote_type="down" value={-downvotes} has_voted={has_downvoted} />
	</div>
</div>
