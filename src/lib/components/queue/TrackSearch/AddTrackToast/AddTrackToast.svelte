<script lang="ts">
	import toast_, { type Toast } from 'svelte-french-toast';

	import { add_track_store } from '$lib/stores';

	export let toast: Toast;

	const track = $add_track_store?.track;
	const delete_track = $add_track_store?.delete_track;

	async function undo_track() {
		toast_.dismiss(toast.id);

		if (track?.uri && delete_track) {
			await delete_track(track.uri);
			// TODO: error handling
		}
	}
</script>

<div>
	<span class="font-bold">{$add_track_store?.track?.name}</span>
	<span class="mr-6">added to Queue</span>
	<button on:click={() => undo_track()} class="p-1.5 rounded-md font-medium text-red-800 hover:bg-red-50">
		Undo
	</button>
</div>
