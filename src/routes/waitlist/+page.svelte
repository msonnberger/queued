<script lang="ts">
	import toast from 'svelte-french-toast';

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

<div class="flex items-center justify-center grow px-4 lg:px-0">
	<div class="max-w-2xl text-center">
		<h1 class="text-5xl sm:text-7xl font-extrabold mb-10">Meet Queued, your collaborative music player.</h1>
		<h2 class="text-xl text-slate-500 dark:text-slate-400 mb-10">
			Tired of one person playing their playlist the whole night? With Queued, everyone votes on which song comes next
			so that the next track will always be the best one.
		</h2>
		<form method="post" class="flex justify-center items-center gap-4">
			<input
				class="h-12 w-64 border-2 border-slate-900 focus:outline-slate-900 bg-slate-50 px-2 rounded-md dark:bg-transparent dark:border-slate-100"
				type="email"
				name="email"
				id="email"
				placeholder="taylor.perry@email.com"
			/>
			<Button type="submit" size="lg">Get Notified</Button>
		</form>
	</div>
</div>
