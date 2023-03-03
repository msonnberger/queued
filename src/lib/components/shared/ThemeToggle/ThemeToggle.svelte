<script lang="ts">
	import { onMount } from 'svelte';
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui';

	let selected_theme: 'dark' | 'light' | 'system';
	let switch_hidden = true;

	onMount(() => {
		selected_theme =
			localStorage.theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
		switch_hidden = false;

		const matcher = window.matchMedia('(prefers-color-scheme: dark)');
		matcher.addEventListener('change', handle_system_theme_change);

		return () => matcher.removeEventListener('change', handle_system_theme_change);
	});

	const handle_system_theme_change = () => {
		if (localStorage.theme === 'system') {
			set_mode('system');
		}
	};

	const set_mode = (theme: 'dark' | 'light' | 'system') => {
		if (theme === 'dark' || (theme == 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		selected_theme = theme;
		localStorage.theme = theme;
	};
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

{#if !switch_hidden}
	<label class="sr-only" for="theme">Theme</label>

	<Listbox value={selected_theme} on:change={(e) => set_mode(e.detail)} class="border-slate-900 bg-slate-500">
		<ListboxButton>{selected_theme}</ListboxButton>
		<ListboxOptions>
			{#each ['light', 'dark', 'system'] as theme}
				<ListboxOption value={theme}>
					{theme}
				</ListboxOption>
			{/each}
		</ListboxOptions>
	</Listbox>
{/if}
