<script lang="ts">
	import toast_, { type Toast } from 'svelte-french-toast';

	import { add_track_store } from '$lib/stores';

	export let toast: Toast;

	const track = $add_track_store?.track;
	const delete_track = $add_track_store?.delete_track;

	async function undo_track() {
		toast_.dismiss(toast.id);

		if (track?.uri && delete_track) {
			const res = await delete_track(track.uri);

			// TODO: error handling
		}
	}
</script>

<div>
	<span>{$add_track_store?.track?.name} added to Queue</span>
	<button on:click={() => undo_track()} class="text-red-900">Undo</button>
</div>
