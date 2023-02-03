<script lang="ts">
	import { onMount } from 'svelte';

	let dark: boolean;
	let switch_hidden = true;

	onMount(() => {
		dark = document.documentElement.classList.contains('dark');
		switch_hidden = false;

		const matcher = window.matchMedia('(prefers-color-scheme: dark)');
		matcher.addEventListener('change', handle_change);

		return () => matcher.removeEventListener('change', handle_change);
	});

	const handle_change = ({ matches: dark }: MediaQueryListEvent) => {
		if (!localStorage.theme) {
			setMode(dark);
		}
	};

	const setMode = (value: boolean) => {
		dark = value;

		if (dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		localStorage.theme = dark ? 'dark' : 'light';

		// if the toggled-to theme matches the system defined theme, clear the local override
		// this effectively provides a way to override or revert to "automatic" setting mode
		if (window.matchMedia(`(prefers-color-scheme: ${localStorage.theme})`).matches) {
			localStorage.removeItem('theme');
		}
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
	<label>
		<input type="checkbox" checked={dark} on:change={() => setMode(!dark)} />
		<span>Toggle dark mode</span>
	</label>
{/if}
