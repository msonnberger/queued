<script lang="ts">
	import toast_, { type Toast } from 'svelte-french-toast';

	import { add_track_store } from '$lib/stores';

	export let toast: Toast;
</script>

<div>
	<span>{$add_track_store?.name} added to Queue</span>
	<button on:click={() => toast_.dismiss(toast.id)} class="text-red-900">Undo</button>
</div>
