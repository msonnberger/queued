<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { debounce } from '$lib/utils';
	import { Button } from '$lib/components';
	import type { TrackObject } from '$lib/api/spotify';
	import { Track } from '$lib/components/queue';
	import { flip } from 'svelte/animate';

	$: ({ id } = $page.params);
	$: ({ queue } = data);

	export let data: PageData;
	let search_results: TrackObject[] = [];

	const handle_change = debounce(async (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.value.length <= 3) {
			return;
		}

		const res = await fetch(`/api/search?q=${input.value}`);
		search_results = (await res.json()) as TrackObject[];
	}, 300);

	const handle_add_song = async (track: TrackObject) => {
		const res = await fetch('/api/queue/add-track', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				track,
				queue_id: id
			})
		});

		// TODO: error handling
		if (!res.ok) {
			throw new Error('Failed to add track');
		}
	};
</script>

<h1>{$queue.name}</h1>
<img src="/queue/{id}/qrcode.svg" alt="QR Code" class="w-80 dark:invert" />
<input type="text" name="" id="" on:input={handle_change} class="border border-slate-900" />
<ul>
	{#each search_results as result}
		<li>
			<form method="post" on:submit|preventDefault={() => handle_add_song(result)}>
				<p>{result.name} - {result.album?.name}</p>
				<Button type="submit">Add</Button>
			</form>
		</li>
	{/each}
</ul>

<ul class="flex flex-col gap-5 mt-8">
	{#each $queue.tracks as track (track.supabase_id)}
		<li animate:flip={{ duration: 300 }}>
			<Track
				title={track.name}
				artist={track.artists ? track.artists[0].name : undefined}
				id={track.supabase_id}
				uri={track.uri}
				upvotes={track.votes.up}
				downvotes={track.votes.down}
				has_upvoted={track.votes.has_upvoted}
				has_downvoted={track.votes.has_downvoted}
			/>
		</li>
	{/each}
</ul>
