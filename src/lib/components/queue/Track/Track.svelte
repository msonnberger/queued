<script lang="ts">
	import { VoteButton } from '$lib/components/queue';
	import type { QueueStore, QueueTrack } from '$lib/types';
	import { format_artists } from '$lib/utils';

	export let track: QueueTrack;
	export let is_up_next = false;
	export let handle_vote: QueueStore['handle_vote'];
</script>

<div
	class="flex justify-between gap-3 bg-slate-200 dark:bg-slate-700 p-4 rounded-md shadow-md"
	class:bg-red-200={is_up_next}
>
	<div>
		<p class="font-bold">{track.name}</p>
		<p>{format_artists(track.artists)}</p>
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
