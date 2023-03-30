<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';

	import { goto, preloadData } from '$app/navigation';
	import { Button } from '$lib/components';

	let qid = '';
	let input_hidden = true;
	let qid_input: HTMLInputElement;

	$: qid = qid.toUpperCase().slice(0, 7);
</script>

<div class="relative text-left">
	<div
		class="absolute top-0 transition-opacity duration-300"
		class:opacity-0={input_hidden}
		class:pointer-events-none={input_hidden}
	>
		<form on:submit|preventDefault={() => goto(`/queue/${qid}`)}>
			<input
				bind:this={qid_input}
				class="text-lg focus:outline-slate-900 block h-12 w-36 border-2 border-slate-900 bg-slate-50 px-2 font-mono rounded-r-3xl rounded-l-md"
				type="text"
				name="qid"
				id="qid"
				placeholder="ABCDEFG"
				autocomplete="off"
				bind:value={qid}
			/>
			<Button
				on:mouseenter={() => preloadData(`/queue/${qid}`)}
				on:touchstart={() => preloadData(`/queue/${qid}`)}
				disabled={qid.length < 7}
				type="submit"
				circle
				size="md"
				class="absolute top-1 right-1 group"
				data-testid="join-queue-arrow"
			>
				<span class="group-hover:translate-x-0.5 transition-transform">
					<ArrowRight size={20} />
				</span>
			</Button>
			<label for="qid" class="text-sm pl-2">Queue ID</label>
		</form>
	</div>
	<Button
		size="lg"
		variant="outline"
		class={input_hidden ? '' : 'invisible'}
		on:click={() => {
			input_hidden = false;
			qid_input.focus();
		}}
	>
		Join Queue
	</Button>
</div>
