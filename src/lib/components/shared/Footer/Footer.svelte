<script lang="ts">
	import spotify_logo from '$lib/assets/spotify-logo.png';
	import { GitHub } from '$lib/components/icons';
</script>

<hr class="w-full mt-12 dark:border-slate-700" />
<footer class="gap-3 w-full flex justify-between items-center px-3 lg:px-8 py-5 text-sm text-slate-400">
	<nav class="flex gap-2 lg:gap-5 items-center">
		<a class="hidden sm:inline" href="https://github.com/msonnberger/queued" rel="noopener noreferrer" target="_blank">
			<GitHub />
			<span class="sr-only">GitHub Repository</span>
		</a>
		<a
			class="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-slate-200 transition-colors"
			href="/privacy">Privacy</a
		>
		<a
			class="text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-slate-200 transition-colors"
			href="/imprint">Imprint</a
		>
	</nav>

	<div class="flex gap-3 lg:gap-5 items-center">
		<span class="text-slate-600 dark:text-slate-400">Data by</span>
		<img alt="Spotify Logo" src={spotify_logo} class="h-9" width="120" height="36" />
	</div>
</footer>
