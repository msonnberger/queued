<script lang="ts">
	import { flip } from 'svelte/animate';

	import { Player, Sidebar, Track, TrackSearch } from '$lib/components/queue';

	export let data;

	$: ({ queue, player, session, spotify_access_token } = data);
</script>

<div>
	<Sidebar queue_name={$queue.name} />
	<main class="ml-[30rem] min-h-full">
		<div class="flex flex-col items-center">
			<div class="flex items-center gap-2">
				<span class="relative flex h-2 w-2">
					<span
						class:animate-ping={$queue.currently_playing}
						class="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
					/>
					<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
				</span>
				{#if $queue.currently_playing?.name}
					<span>Current song: {$queue.currently_playing.name}</span>
				{:else}
					<span>Currently nothing playing</span>
				{/if}
			</div>

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

			{#if spotify_access_token && $queue.owner_id === session?.user.id}
				<Player player_store={player} queue_store={queue} {spotify_access_token} />
			{/if}
		</div>
	</main>
</div>
