<script lang="ts">
	import { VoteButton } from '$lib/components/queue';
	import type { QueueStore, QueueTrack } from '$lib/types';
	import { format_artists } from '$lib/utils';

	export let track: QueueTrack;
	export let is_up_next = false;
	export let handle_vote: QueueStore['handle_vote'];
</script>

<div
	class="flex justify-between items-center gap-3 bg-slate-200 dark:bg-slate-700 p-4 rounded-md shadow-md"
	class:bg-red-200={is_up_next}
>
	<div class="flex items-center">
		<img src={track?.album?.images[2].url} alt="Album cover" />
		<div class="pl-2">
			<p class="truncate text-base font-bold leading-6">{track.name}</p>
			<p class="cate text-sm font-normal text-slate-500 dark:text-slate-400">{format_artists(track.artists)}</p>
		</div>
	</div>
	<div class="flex gap-2">
		<VoteButton
			on:click={() => handle_vote(track.supabase_id, 1)}
			vote_type="up"
			value={track.votes.up}
			has_voted={track.votes.own_vote === 'up'}
		/>
		<VoteButton
			on:click={() => handle_vote(track.supabase_id, -1)}
			vote_type="down"
			value={-track.votes.down}
			has_voted={track.votes.own_vote === 'down'}
		/>
	</div>
</div>
