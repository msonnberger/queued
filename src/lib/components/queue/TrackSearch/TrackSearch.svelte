<script lang="ts">
	import { Check, ChevronsUpDown, Plus } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { createCombobox } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	import type { TrackObject } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import { add_track_store } from '$lib/stores';
	import type { QueueStore } from '$lib/types';
	import { debounce, format_artists } from '$lib/utils';
	import AddTrackToast from './AddTrackToast/AddTrackToast.svelte';

	export let add_track: QueueStore['add_track'];

	let search_results: TrackObject[] = [];
	let input: HTMLInputElement;
	const combobox = createCombobox({ label: 'Tracks', selected: { name: '' } });

	const handle_change = debounce(async () => {
		if ($combobox.filter.length <= 2) {
			return;
		}

		const res = await fetch(`/api/search?q=${$combobox.filter}`);
		search_results = (await res.json()) as TrackObject[];
	}, 300);

	const on_select = async (e: Event) => {
		const selected = (e as CustomEvent).detail?.selected ?? null;

		if (selected) {
			const track: TrackObject = selected;
			const res = await add_track(track);
			input.value = '';

			// TODO: error handling
			if (res.ok) {
				$add_track_store = track;
				toast(AddTrackToast, { position: 'top-right', duration: 2000 });
			} else if (res.status === 409) {
				toast.error(`${track.name} is already in Queue`, { position: 'top-right', duration: 2000 });
			} else {
				throw new Error('Failed to add track');
			}
		}
	};
</script>

<div class="flex w-full max-w-md flex-col items-center justify-center">
	<div class="relative mt-1 w-full">
		<div
			class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300"
		>
			<input
				bind:this={input}
				use:combobox.input
				on:select={on_select}
				on:input={handle_change}
				placeholder="Search Songs"
				class="w-full border-none py-3 pl-4 pr-10 leading-5 text-gray-900 focus:ring-0 outline-0"
				autocomplete="off"
			/>
			<button use:combobox.button class="absolute inset-y-0 right-0 flex items-center pr-2" type="button">
				<ChevronsUpDown class="h-5 w-5 text-gray-400" />
			</button>
		</div>

		{#if $combobox.filter.length > 2}
			<Transition
				show={$combobox.expanded}
				leave="transition ease-in duration-100"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<ul
					use:combobox.items
					class="absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					{#each search_results as result}
						{@const active = $combobox.active === result}
						{@const selected = $combobox.selected === result}

						<li class="relative select-none flex justify-between items-center pl-4 pr-4 py-2">
							<img src={result?.album?.images[2].url} alt="Album cover" />
							<div class="truncate pl-2 w-full">
								<span class="block truncate text-base font-bold leading-6 {selected ? 'font-medium' : 'font-normal'}">
									{result.name}
								</span>
								<span
									class="block truncate text-sm text-slate-500 dark:text-slate-400 {selected
										? 'font-medium'
										: 'font-normal'}"
								>
									{format_artists(result.artists)}
								</span>
							</div>
							<div class="pl-2" use:combobox.item={{ value: result }}>
								<Button circle size="sm" data-testid="add-track-button">
									{#if selected}
										<Check class="hover:cursor-pointer" />
									{:else}
										<Plus class="hover:cursor-pointer" />
									{/if}
								</Button>
							</div>

							{#if selected}
								<span
									class="absolute inset-y-0 left-0 flex items-center pl-3 {active ? 'text-white' : 'text-teal-600'}"
								>
									<Check class="h-5 w-5" />
								</span>
							{/if}
						</li>
					{:else}
						<li class="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900">
							<span class="block truncate font-normal">Nothing found</span>
						</li>
					{/each}
				</ul>
			</Transition>
		{/if}
	</div>
</div>
