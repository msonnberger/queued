<script lang="ts">
	import { XIcon } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import { get_focusable_elements } from '$lib/utils';

	function trap_focus(element: HTMLElement) {
		const focusable_elements = get_focusable_elements(element);
		const first_focusable_element = focusable_elements[0] as HTMLElement;
		const last_focusable_element = focusable_elements[focusable_elements.length - 1] as HTMLElement;
		const previously_focused_element = document.activeElement as HTMLElement | null;

		if (focusable_elements[1] && first_focusable_element.classList.contains('share-sheet-close-button')) {
			(focusable_elements[1] as HTMLElement)?.focus();
		} else {
			first_focusable_element.focus();
		}

		function on_keydown(e: KeyboardEvent) {
			const is_tab_pressed = e.key === 'Tab';

			if (!is_tab_pressed) {
				return;
			}

			if (e.shiftKey) {
				/* shift + tab */ if (document.activeElement === first_focusable_element) {
					last_focusable_element.focus();
					e.preventDefault();
				}
			} /* tab */ else {
				if (document.activeElement === last_focusable_element) {
					first_focusable_element.focus();
					e.preventDefault();
				}
			}
		}

		element.addEventListener('keydown', on_keydown);

		return {
			destroy: () => {
				element.removeEventListener('keydown', on_keydown);
				previously_focused_element?.focus();
			}
		};
	}

	export let open: boolean;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') open = false;
	}}
/>

{#if open}
	<div id="share-sheet">
		<!-- svelte-ignore a11y-click-events-have-key-events handled by svelte:window -->
		<div
			on:click={() => (open = false)}
			transition:fade={{ duration: 200 }}
			class="bg-black/70 fixed inset-0 flex items-end justify-center"
		>
			<div
				use:trap_focus
				on:click|stopPropagation
				transition:fly={{ y: 500, duration: 300 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="share-sheet-title"
				class="p-8 bg-slate-50 dark:bg-slate-700 rounded-t-3xl w-full max-w-xl shadow-xl"
			>
				<div class="flex items-center justify-between">
					<h3 class="font-bold" id="share-sheet-title">Share</h3>
					<button on:click={() => (open = false)} class="share-sheet-close-button">
						<XIcon size={20} />
					</button>
				</div>
				<img src="{$page.url.pathname}/qrcode.svg" alt="QR Code" class="w-40 h-40 dark:invert" />
			</div>
		</div>
	</div>
{/if}
