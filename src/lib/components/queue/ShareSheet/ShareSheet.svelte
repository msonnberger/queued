<script lang="ts">
	import { ClipboardCopy, CopyIcon, Files, XIcon } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import Messages from '$lib/components/icons/Messages.svelte';
	import WhatsApp from '$lib/components/icons/WhatsApp.svelte';
	import { get_focusable_elements, is_mobile_browser } from '$lib/utils';

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

	$: encoded_text = encodeURIComponent('Join my Queue!\n' + $page.url.href);
	$: whatsapp_url = `https://${is_mobile_browser() ? 'api' : 'web'}.whatsapp.com/send?text=${encoded_text}`;
	$: sms_url = `sms:?&body=${encoded_text}`;

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
				transition:fly={{ y: '100%', duration: 300 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="share-sheet-title"
				class="py-6 px-7 bg-slate-50 dark:bg-slate-700 rounded-t-2xl w-full max-w-xl shadow-xl flex flex-col items-center"
			>
				<div class="grid grid-cols-3 w-full">
					<h3 class="font-bold col-start-2 justify-self-center uppercase text-sm tracking-wide" id="share-sheet-title">
						Share Queue
					</h3>
					<button on:click={() => (open = false)} class="share-sheet-close-button justify-self-end">
						<XIcon size={20} />
					</button>
				</div>
				<div class="flex flex-wrap mb-5 mt-6 gap-3 items-stretch justify-center">
					<img
						src="{$page.url.pathname}/qrcode.svg"
						alt="QR Code"
						class="w-full max-w-[16rem] sm:max-w-[12rem] aspect-square p-6 bg-slate-200 dark:bg-slate-600 rounded-2xl"
					/>
					<div class="py-6 px-8 bg-slate-200 dark:bg-slate-600 rounded-2xl flex flex-col justify-center">
						<p
							title="Queue ID"
							id="queue-id"
							class="cursor-default px-4 text-center bg-slate-100 dark:bg-slate-500 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-900 border-2 rounded-xl font-mono font-medium text-xl tracking-[0.2em] h-14 leading-[3.5rem]"
						>
							{$page.params.id}
						</p>
						<div class="flex gap-3 mt-3 items-start h-min">
							<a href={whatsapp_url} target="_blank" class="block p-2.5 rounded-xl bg-emerald-500 w-14 h-14">
								<WhatsApp />
							</a>
							<a href={sms_url} target="_blank" class="block aspect-square w-14 h-14">
								<Messages />
							</a>
							<button
								class="bg-slate-400 rounded-xl p-3 block aspect-square w-14 h-14"
								on:click={() => navigator.clipboard.writeText(decodeURIComponent(encoded_text))}
							>
								<Files color="#fff" class="w-full h-full" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
