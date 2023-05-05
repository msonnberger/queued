<script lang="ts">
	import toast from 'svelte-french-toast';

	import mockup from '$lib/assets/mockup.webp';
	import { Button } from '$lib/components';

	export let form;

	$: {
		if (form?.success) {
			toast.success("You'll hear from us soon :)", { position: 'top-center' });
		} else if (form?.success === false) {
			toast.error('Oops, somthing went wrong...', { position: 'top-center' });
		}
	}
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="flex flex-col items-center justify-center grow px-4 lg:px-0">
	<div class="max-w-2xl text-center mt-20">
		<span
			class="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium mb-6 px-3 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300"
		>
			Coming Soon
		</span>

		<h1 class="text-4xl sm:text-7xl font-extrabold mb-10">Meet Queued, your collaborative music player.</h1>
		<h2 class="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-20">
			Tired of one person playing their playlist the whole night? With Queued, everyone votes on which song comes next
			so that the next track will always be the best one.
		</h2>
		<form method="post" class="flex justify-center items-center gap-4">
			<input
				class="h-12 w-64 border-2 border-slate-900 focus:outline-slate-900 bg-slate-50 px-2 rounded-md dark:bg-transparent dark:border-slate-100"
				type="email"
				name="email"
				id="email"
				placeholder="taylor@music.com"
			/>
			<Button type="submit" size="lg">Join Waitlist</Button>
		</form>
	</div>
	<img src={mockup} alt="Queue Player on Desktop and iPhone" class="w-full max-w-6xl mt-20" />
</div>
