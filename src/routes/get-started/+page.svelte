<script lang="ts">
	import { Button } from '$lib/components';
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="flex items-center justify-center grow px-4 lg:px-0">
	<div class="max-w-2xl text-center">
		<h1 class="text-5xl sm:text-7xl font-extrabold mb-10">Meet Queued, your collaborative music player.</h1>
		<h2 class="text-xl text-slate-500 dark:text-slate-400 mb-10">
			Tired of one person playing their playlist the whole night? With Queued, everyone votes on which song comes next
			so that the next track will always be the best one.
		</h2>
		<div class="flex gap-3 justify-center">
			<Button size="lg" href="/queue/new">Join Waitlist</Button>
      <input type="email" >
      <!-- TODO: Save E-Mail in Supabase -->
		</div>
	</div>
</div>
