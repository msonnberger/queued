<script lang="ts">
	import { onMount } from 'svelte';
	import { createMenu } from 'svelte-headlessui';
	import Transition from 'svelte-transition';
	import { SunDim, Moon, MonitorSmartphone } from 'lucide-svelte';

	let switch_disabled = true;
	let is_dark_shown: boolean;
	let selected_theme: 'light' | 'dark' | 'system';

	onMount(() => {
		selected_theme = localStorage.theme ?? 'system';
		is_dark_shown =
			localStorage.theme === 'dark' ||
			(!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
		switch_disabled = false;

		const matcher = window.matchMedia('(prefers-color-scheme: dark)');
		matcher.addEventListener('change', handle_system_theme_change);

		return () => matcher.removeEventListener('change', handle_system_theme_change);
	});

	const handle_system_theme_change = () => {
		if (localStorage.theme === 'system') {
			set_mode('system');
		}
	};

	const set_mode = (theme: typeof selected_theme) => {
		if (theme === 'dark' || (theme == 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
			is_dark_shown = true;
		} else {
			document.documentElement.classList.remove('dark');
			is_dark_shown = false;
		}

		selected_theme = theme;
		localStorage.theme = theme;
	};

	const menu = createMenu({ label: 'Themes' });

	function on_select(e: Event) {
		set_mode((e as CustomEvent).detail.selected.toLowerCase());
	}

	const options = [
		{ icon: SunDim, text: 'Light' },
		{ icon: Moon, text: 'Dark' },
		{ icon: MonitorSmartphone, text: 'System' }
	];
</script>

<svelte:head>
	<!-- set dark mode class based on user preference / device settings (in head to avoid FOUC) -->
	<script>
		if (
			localStorage.theme === 'dark' ||
			(!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	</script>
</svelte:head>

<div class="flex  flex-col items-center justify-center">
	<div class="relative text-right">
		<div class="relative inline-block text-left">
			<button use:menu.button on:select={on_select} disabled={switch_disabled} class:invisible={switch_disabled}>
				<svelte:component
					this={is_dark_shown ? Moon : SunDim}
					class="stroke-slate-700 dark:stroke-slate-300"
					size={is_dark_shown ? 23 : 26}
				/>
			</button>

			<Transition
				show={$menu.expanded}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<div
					use:menu.items
					class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					<div class="px-1 py-1">
						{#each options as option}
							{@const selected = selected_theme === option.text.toLowerCase()}
							{@const active = $menu.active === option.text || (!$menu.active && selected)}
							<button
								use:menu.item
								type="button"
								class="group flex rounded-md items-center w-full pl-2 pr-7 py-2 text-sm font-semibold
										{selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-100'}"
								class:bg-slate-100={active}
								class:dark:bg-slate-700={active}
							>
								<svelte:component
									this={option.icon}
									class="w-5 h-5 mr-3 {selected ? 'stroke-indigo-600 dark:stroke-indigo-400' : 'stroke-slate-400'}"
								/>
								{option.text}
							</button>
						{/each}
					</div>
				</div>
			</Transition>
		</div>
	</div>
</div>
