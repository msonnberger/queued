<script lang="ts">
	import { QrCodeIcon } from 'lucide-svelte';
	import { flip } from 'svelte/animate';

	import { page } from '$app/stores';
	import { Player, ShareSheet, Track, TrackSearch } from '$lib/components/queue';

	$: ({ queue, player, session, spotify_access_token } = data);
	let show_share_sheet = $page.url.searchParams.get('share') === 'true';

	export let data;
</script>

<main class="w-full max-w-md">
	{#if $queue.currently_playing?.name}
		<div class="flex items-center gap-2">
			<span class="relative flex h-2 w-2">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
				<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
			</span>
			<span>Currently playing: {$queue.currently_playing.name}</span>
		</div>
	{/if}

	<h1 class="font-bold text-5xl">{$queue.name}</h1>
	<button class="my-20 flex gap-2" on:click={() => (show_share_sheet = true)}>
		<QrCodeIcon />
		<span>Share</span>
	</button>

	<TrackSearch add_track={queue.add_track} />

	<ul class="flex flex-col gap-5 mt-8 w-full max-w-md">
		{#each $queue.tracks as track (track.supabase_id)}
			<li animate:flip={{ duration: 300 }}>
				<Track
					{track}
					add_vote={queue.add_vote}
					delete_vote={queue.delete_vote}
					is_up_next={track.uri === $player.up_next_uri}
				/>
			</li>
		{/each}
	</ul>

	{#if spotify_access_token && $queue.owner_id === session?.user.id}
		<Player player_store={player} queue_store={queue} {spotify_access_token} />
	{/if}

	<ShareSheet bind:open={show_share_sheet} />
</main>
