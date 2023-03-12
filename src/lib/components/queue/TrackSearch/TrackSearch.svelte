<script lang="ts">
	import { Check, ChevronsUpDown, Plus } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { createCombobox } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	import type { TrackObject } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { QueueStore } from '$lib/types';
	import { debounce, format_artists } from '$lib/utils';

	export let add_track: QueueStore['add_track'];

	let search_results: TrackObject[] = [];
	let input_value = '';

	const handle_change = debounce(async (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.value.length <= 3) {
			return;
		}

		const res = await fetch(`/api/search?q=${input.value}`);
		search_results = (await res.json()) as TrackObject[];
	}, 300);

	const combobox = createCombobox({ label: 'Tracks', selected: { name: '' } });

	const on_select = async (e: Event) => {
		const selected = (e as CustomEvent).detail?.selected ?? null;

		if (selected) {
			const track: TrackObject = selected;
			const res = await add_track(track);

			// TODO: error handling
			if (res.ok) {
				toast.success(`${track.name} added to Queue`, { duration: 2000 });
			} else if (res.status === 409) {
				toast.error(`${track.name} is already in Queue`, { duration: 2000 });
			} else {
				throw new Error('Failed to add track');
			}
		}
	};
</script>

<div class="flex w-full flex-col items-center justify-center">
	<div class="min-w-[25rem] w-72">
		<div class="relative mt-1">
			<div
				class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
			>
				<input
					use:combobox.input
					on:select={on_select}
					on:input={handle_change}
					bind:value={input_value}
					class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-0"
					autocomplete="off"
				/>
				<button use:combobox.button class="absolute inset-y-0 right-0 flex items-center pr-2" type="button">
					<ChevronsUpDown class="h-5 w-5 text-gray-400" />
				</button>
			</div>

			{#if input_value.length > 3}
				<Transition
					show={$combobox.expanded}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					on:after-leave={() => combobox.reset()}
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
									<Button circle size="sm">
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
</div>

<!-- <input type="text" name="" id="" on:input={handle_change} class="border border-slate-900" />
<ul>
	{#each search_results as result}
		<li class="m-4">
			<form method="post" on:submit|preventDefault={() => handle_add_track(result)} class="flex justify-between">
				<div>
					<p>{result.name}</p>
					<p>{format_artists(result.artists)}</p>
				</div>
				<Button type="submit">Add</Button>
			</form>
		</li>
	{/each}
</ul> -->
