<!-- TODO: Eventuell component löschen -->
<script lang="ts">
	import { Files, MessageCircle } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { fade, fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import type { TrackObject } from '$lib/api/spotify';
	import { WhatsApp } from '$lib/components/icons';
	import { get_focusable_elements, is_mobile_browser } from '$lib/utils';

	function trap_focus(element: HTMLElement) {
		const focusable_elements = get_focusable_elements(element);
		const first_focusable_element = focusable_elements.at(0) as HTMLElement;
		const last_focusable_element = focusable_elements.at(-1) as HTMLElement;
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
				if (document.activeElement === first_focusable_element) {
					last_focusable_element.focus();
					e.preventDefault();
				}
			} else {
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

	$: encoded_text = encodeURIComponent('Join my Queue!\n' + $page.url.href);
	$: whatsapp_url = `https://${is_mobile_browser() ? 'api' : 'web'}.whatsapp.com/send?text=${encoded_text}`;
	$: sms_url = `sms:?&body=${encoded_text}`;

	export let open: boolean;
	export let queue_currently_playing: TrackObject | undefined;
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
			class="bg-black/70 fixed z-50 inset-0 flex items-end justify-center"
		>
			<div
				use:trap_focus
				on:click|stopPropagation
				transition:fly={{ y: '100%', duration: 300 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="share-sheet-title"
				class="py-6 px-7 bg-slate-50 dark:bg-slate-700 rounded-t-2xl w-full max-w-xl shadow-xl flex flex-col items-center"
			>
				<img src="{$page.url.pathname}/qrcode.svg" alt="QR Code" class="aspect-square mb-8 dark:invert max-w-[13rem]" />

				<div>
					<p
						title="Queue ID"
						id="queue-id"
						class="cursor-default px-4 text-center bg-slate-100 dark:bg-slate-500 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 border-2 rounded-xl font-mono font-medium text-xl tracking-[0.2em] h-14 leading-[3.5rem]"
					>
						{$page.params.id}
					</p>

					<div class="flex items-center gap-2 mt-6">
						<span class="relative flex h-2 w-2">
							<span
								class:animate-ping={queue_currently_playing}
								class="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
							/>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
						</span>
						{#if queue_currently_playing?.name}
							<span>Current song: {queue_currently_playing?.name}</span>
						{:else}
							<span>Currently nothing is playing</span>
						{/if}
					</div>

					<section class="mt-6">
						<h2 class="font-mono text-sm font-medium leading-7 text-slate-900 dark:text-slate-200">Share this Queue</h2>

						<ul class="mt-2 flex flex-col gap-3">
							<li class="flex">
								<a
									href={whatsapp_url}
									target="_blank"
									class="flex items-center rounded-lg -ml-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-600"
								>
									<WhatsApp width={25} height={25} />
									<span class="ml-3">WhatsApp</span></a
								>
							</li>
							<li class="flex">
								<a
									href={sms_url}
									target="_blank"
									class="flex items-center rounded-lg -ml-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-600"
								>
									<MessageCircle size="28" class="stroke-slate-500 -translate-x-0.5" />
									<span class="ml-3 -translate-x-0.5">Messages</span></a
								>
							</li>

							<li class="flex">
								<button
									class=" flex rounded-lg -ml-3 px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-600"
									on:click={() => {
										navigator.clipboard.writeText(decodeURIComponent(encoded_text));
										toast.success('Copied Queue Link', { duration: 1250 });
									}}
								>
									<Files class="h-full stroke-slate-500" />
									<span class="ml-3">Copy Link</span>
								</button>
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	</div>
{/if}
