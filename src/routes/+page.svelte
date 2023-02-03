<script lang="ts">
	import { Button } from '$lib/components';
	import { ArrowRight } from 'lucide-svelte';

	let qid = '';
	let input_hidden = true;
	$: qid = qid.toUpperCase().slice(0, 7);
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="grow grid place-items-center">
	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
	<div class="flex gap-3">
		<Button href="/queue/new">Create Queue</Button>
		<div class="relative">
			<div
				class="absolute top-0 transition-opacity duration-300"
				class:opacity-0={input_hidden}
				class:pointer-events-none={input_hidden}
			>
				<input
					class="block h-10 w-36 border-2 border-slate-900 bg-slate-50 px-2 font-mono rounded-r-3xl rounded-l-md"
					type="text"
					name="qid"
					placeholder="ABCDEFG"
					bind:value={qid}
				/>
				<Button disabled={qid.length < 7} href="/queue/{qid}" circle size="sm" class="absolute top-1 right-1 group">
					<span class="group-hover:translate-x-0.5 transition-transform">
						<ArrowRight size={16} />
					</span>
				</Button>
				<label for="qid" class="text-sm pl-2">Queue ID</label>
			</div>
			<Button variant="outline" class={input_hidden ? '' : 'invisible'} on:click={() => (input_hidden = false)}>
				Join Queue
			</Button>
		</div>
	</div>
</div>
