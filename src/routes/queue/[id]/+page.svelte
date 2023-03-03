<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { Player, Track, TrackSearch } from '$lib/components/queue';
	import { flip } from 'svelte/animate';
	import { spotify_tokens } from '$lib/stores';

	$: ({ id } = $page.params);
	$: ({ queue, player, session } = data);

	export let data: PageData;

	const handle_vote = (track_id: number, value: 1 | -1) => {
		fetch('/api/queue/vote', {
			method: 'POST',
			body: JSON.stringify({ supabase_id: track_id, value, queue_id: id })
		});
	};
</script>

{#if $queue?.currently_playing?.name}
	<div class="flex items-center gap-2">
		<span class="relative flex h-2 w-2">
			<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
			<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
		</span>
		<span>Currently playing: {$queue.currently_playing.name}</span>
	</div>
{/if}

<h1>{$queue.name}</h1>
<img src="/queue/{id}/qrcode.svg" alt="QR Code" class="w-80 dark:invert" />

<TrackSearch {id} />

<ul class="flex flex-col gap-5 mt-8">
	{#each $queue.tracks as track (track.supabase_id)}
		<li animate:flip={{ duration: 300 }}>
			<Track {track} {handle_vote} is_up_next={track.uri === $player.up_next_uri} />
		</li>
	{/each}
</ul>



{#if $spotify_tokens.access_token && $queue.owner_id === session?.user.id}
	<Player player_store={player} queue_store={queue} />
{/if}
