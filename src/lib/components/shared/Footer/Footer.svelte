<script lang="ts">
	import spotify_logo from '$lib/assets/spotify-logo.png';
	import { GitHub } from '$lib/components/icons';

	export let is_queue_page: boolean;
</script>

{#if is_queue_page}
	<hr />
{/if}
<footer
	class="w-full flex justify-between items-center px-8 py-5 text-sm text-slate-400 {is_queue_page
		? 'bg-transparent'
		: 'dark:bg-slate-800 bg-white'}"
>
	<nav class="flex gap-5 items-center">
		<a href="https://github.com/msonnberger/queued" rel="noopener noreferrer" target="_blank">
			<GitHub />
			<span class="sr-only">GitHub Repository</span>
		</a>
		<a class="hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="/privacy">Privacy</a>
		<a class="hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="/imprint">Imprint</a>
	</nav>

	<div class="flex gap-5 items-center">
		<span>All data provided by</span>
		<img alt="Spotify Logo" src={spotify_logo} class="h-9" />
	</div>
</footer>
