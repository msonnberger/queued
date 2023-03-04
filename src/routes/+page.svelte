<script lang="ts">
	import { Button } from '$lib/components';
	import spotify_logo from '$lib/assets/spotify-logo.png';
	import { JoinQueue } from '$lib/components/landing-page';
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="grow grid place-items-center">
	<div class="max-w-2xl text-center">
		<h1 class="text-5xl sm:text-7xl font-extrabold mb-10">Meet Queued, your collaborative DJ.</h1>
		<h2 class="text-xl text-slate-500 dark:text-slate-400 mb-10">
			Tired of one person playing their playlist the whole night? With Queued, everyone votes on which song comes next
			so that the next track will always be the best one.
		</h2>
		<div class="flex gap-3 justify-center">
			<Button size="lg" href="/queue/new">Create Queue</Button>
			<JoinQueue />
		</div>
	</div>
</div>

<footer class="w-screen bg-white dark:bg-slate-800 flex justify-between items-center px-8 py-5 text-sm text-slate-400">
	<nav class="flex gap-5 items-center">
		<a class="hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="/privacy">Privacy</a>
		<a class="hover:text-slate-700 dark:hover:text-slate-200 transition-colors" href="/imprint">Imprint</a>
	</nav>

	<div class="flex gap-5 items-center">
		<span>All data provided by</span>
		<img alt="Spotify Logo" src={spotify_logo} class="h-9" />
	</div>
</footer>
