<script lang="ts">
	import toast_, { type Toast } from 'svelte-french-toast';

	import { add_track_store } from '$lib/stores';

	export let toast: Toast;
</script>

<span>
	{$add_track_store?.name} added to Queue
	<button on:click={() => toast_.dismiss(toast.id)} class="text-red-800">Undo</button>
</span>
