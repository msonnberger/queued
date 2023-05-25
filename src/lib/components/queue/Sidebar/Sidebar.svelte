<script lang="ts">
	import { Files, MessageCircle } from 'lucide-svelte';
	import toast from 'svelte-french-toast';

	import { page } from '$app/stores';
	import type { TrackObject } from '$lib/api/spotify';
	import { WhatsApp } from '$lib/components/icons';
	import { is_mobile_browser } from '$lib/utils';

	export let queue_currently_playing: TrackObject | undefined;

	$: encoded_text = encodeURIComponent('Join me on Queued!\n' + $page.url.href);
	$: whatsapp_url = `https://${is_mobile_browser() ? 'api' : 'web'}.whatsapp.com/send?text=${encoded_text}`;
	$: sms_url = `sms:?&body=${encoded_text}`;
</script>

<aside
	class="bg-neutral-50 border-r dark:border-slate-600 p-12 row-span-2 overflow-hidden hidden lg:fixed lg:block inset-y-0 left-0 w-sidebar dark:bg-slate-700"
>
	<img
		src="{$page.url.pathname}/qrcode.svg"
		alt="QR Code"
		class="aspect-square mb-8 dark:invert"
		width="290"
		height="290"
	/>

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
						<span class="ml-3 -translate-x-1">Messages</span></a
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
</aside>
