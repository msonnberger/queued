<script lang="ts">
	import mockup from '$lib/assets/mockup.webp';
	import { Button } from '$lib/components';
	import { JoinQueue } from '$lib/components/landing-page';
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="flex items-center flex-col justify-center grow px-4 lg:px-0">
	<div class="max-w-2xl text-center mt-20">
		<h1 class="text-4xl sm:text-7xl font-extrabold mb-10">Meet Queued, your collaborative music player.</h1>
		<h2 class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10">
			Tired of one person playing their playlist the whole night? With Queued, everyone votes on which song comes next
			so that the next track will always be the best one.
		</h2>
		<div class="flex gap-3 justify-center">
			<Button size="lg" href="/queue/new">Create Queue</Button>
			<JoinQueue />
		</div>
	</div>
	<img src={mockup} alt="Queue Player on Desktop and iPhone" class="w-full max-w-6xl mt-20" />
</div>
