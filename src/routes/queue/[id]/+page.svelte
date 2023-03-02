<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { Button } from '$lib/components';
	import type { TrackObject } from '$lib/api/spotify';
	import { Player, Track, TrackSearch } from '$lib/components/queue';
	import { flip } from 'svelte/animate';
	import { spotify_tokens } from '$lib/stores';

	$: ({ id } = $page.params);
	$: ({ queue, player, session } = data);

	export let data: PageData;

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
