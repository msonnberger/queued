<script lang="ts">
	import { VoteButton } from '$lib/components/queue';
	import type { QueueStore, QueueTrack } from '$lib/types';
	import { format_artists } from '$lib/utils';

	export let track: QueueTrack;
	export let is_up_next = false;
	export let add_vote: QueueStore['add_vote'];
	export let delete_vote: QueueStore['delete_vote'];

	function handle_vote(track_id: number, type: 'up' | 'down', own_vote: QueueTrack['votes']['own_vote']) {
		if (type === own_vote) {
			delete_vote(track_id);
		} else {
			const is_vote_flipped = own_vote !== null;
			add_vote(track_id, type === 'up' ? 1 : -1, is_vote_flipped);
		}
	}
</script>

<div
	class="flex justify-between items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-md shadow-md"
	class:bg-red-200={is_up_next}
	data-testid="track-item"
>
	<div class="flex items-center">
		<img src={track?.album?.images[2].url} alt="Album cover" />
		<div class="pl-2 max-w-[14rem]">
			<p class="truncate text-base font-bold leading-6">{track.name}</p>
			<p class="cate text-sm font-normal text-slate-500 dark:text-slate-400">{format_artists(track.artists)}</p>
		</div>
	</div>
	<div class="flex gap-2">
		<VoteButton
			on:click={() => handle_vote(track.supabase_id, 'up', track.votes.own_vote)}
			vote_type="up"
			value={track.votes.up}
			has_voted={track.votes.own_vote === 'up'}
		/>
		<VoteButton
			on:click={() => handle_vote(track.supabase_id, 'down', track.votes.own_vote)}
			vote_type="down"
			value={-track.votes.down}
			has_voted={track.votes.own_vote === 'down'}
		/>
	</div>
</div>
