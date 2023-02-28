<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { debounce, format_artists } from '$lib/utils';
	import { Button } from '$lib/components';
	import type { TrackObject } from '$lib/api/spotify';
	import { Player, Track } from '$lib/components/queue';
	import { flip } from 'svelte/animate';

	$: ({ id } = $page.params);
	$: ({ queue, player, session } = data);

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

	const handle_add_track = async (track: TrackObject) => {
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

	const handle_vote = (track_id: number, value: 1 | -1) => {
		fetch('/api/queue/vote', {
			method: 'POST',
			body: JSON.stringify({ supabase_id: track_id, value, queue_id: id })
		});
	};
</script>

<h1>{$queue.name}</h1>
<img src="/queue/{id}/qrcode.svg" alt="QR Code" class="w-80 dark:invert" />
<input type="text" name="" id="" on:input={handle_change} class="border border-slate-900" />
<ul>
	{#each search_results as result}
		<li class="m-4">
			<form method="post" on:submit|preventDefault={() => handle_add_track(result)} class="flex justify-between">
				<div>
					<p>{result.name}</p>
					<p>{format_artists(result.artists)}</p>
				</div>
				<Button type="submit">Add</Button>
			</form>
		</li>
	{/each}
</ul>

<ul class="flex flex-col gap-5 mt-8">
	{#each $queue.tracks as track (track.supabase_id)}
		<li animate:flip={{ duration: 300 }}>
			<Track {track} {handle_vote} />
		</li>
	{/each}
</ul>

{#if typeof session?.provider_token === 'string'}
	<Player
		player_store={player}
		queue_tracks={$queue.tracks}
		remove_track={$queue.remove_track}
		spotify_token={session.provider_token}
	/>
{/if}
