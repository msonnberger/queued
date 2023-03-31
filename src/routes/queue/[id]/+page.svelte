<script lang="ts">
	import { Share2Icon } from 'lucide-svelte';
	import { flip } from 'svelte/animate';

	import { Footer } from '$lib/components';
	import { Player, Sidebar, Track, TrackSearch } from '$lib/components/queue';
	import ShareSheet from '$lib/components/queue/ShareSheet/ShareSheet.svelte';

	export let data;

	$: ({ queue, player, session, spotify_access_token } = data);
	$: show_player = spotify_access_token && $queue.owner_id === session?.user.id;

	let show_share_sheet = false;
</script>

<svelte:head>
	<title>Queued • {$queue.id}</title>
</svelte:head>

<Sidebar queue_currently_playing={$queue.currently_playing} />
<ShareSheet bind:open={show_share_sheet} queue_currently_playing={$queue.currently_playing} />

<main class="lg:ml-sidebar flex flex-col items-center flex-1 px-4 lg:px-0" class:mb-40={show_player}>
	<div class="flex-1 flex flex-col max-w-lg w-full">
		<h1 class="text-5xl text-center font-bold mt-4 lg:mt-10 mb-10 lg:mb-20">{$queue.name}</h1>

		<div class="flex items-end gap-4">
			<button on:click={() => (show_share_sheet = !show_share_sheet)} class="grid place-items-center gap-y-1 lg:hidden">
				<Share2Icon />
				<span class="text-sm leading-none">Share</span>
			</button>
			<TrackSearch add_track={queue.add_track} delete_track={queue.delete_track} />
		</div>

		<ul class="flex flex-col gap-5 mt-8">
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
	</div>
	<Footer />
</main>
{#if show_player}
	<Player player_store={player} queue_store={queue} spotify_access_token={spotify_access_token ?? ''} />
{/if}
