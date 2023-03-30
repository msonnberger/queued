<script lang="ts">
	import { flip } from 'svelte/animate';

	import { Footer } from '$lib/components';
	import { Player, Sidebar, Track, TrackSearch } from '$lib/components/queue';

	export let data;

	$: ({ queue, player, session, spotify_access_token } = data);
	$: show_player = spotify_access_token && $queue.owner_id === session?.user.id;
</script>

<Sidebar queue_name={$queue.name} queue_currently_playing={$queue.currently_playing} />
<main class="ml-sidebar flex flex-col flex-1" class:mb-40={show_player}>
	<div class="flex-1 flex flex-col items-center">
		<TrackSearch add_track={queue.add_track} delete_track={queue.delete_track} />

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
	</div>
	<Footer />
</main>
{#if show_player}
	<Player player_store={player} queue_store={queue} spotify_access_token={spotify_access_token ?? ''} />
{/if}
