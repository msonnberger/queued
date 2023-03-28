<script lang="ts">
	import { Files } from 'lucide-svelte';

	import { page } from '$app/stores';
	import Messages from '$lib/components/icons/Messages.svelte';
	import WhatsApp from '$lib/components/icons/WhatsApp.svelte';
	import { is_mobile_browser } from '$lib/utils';

	export let queue_name: string;

	$: encoded_text = encodeURIComponent('Join my Queue!\n' + $page.url.href);
	$: whatsapp_url = `https://${is_mobile_browser() ? 'api' : 'web'}.whatsapp.com/send?text=${encoded_text}`;
	$: sms_url = `sms:?&body=${encoded_text}`;
</script>

<aside class="fixed inset-y-0 left-0 bg-neutral-50 border-x w-[30rem] max-w-[30rem]">
	<div class="max-w-full min-h-full p-12">
		<img src="{$page.url.pathname}/qrcode.svg" alt="QR Code" class="px-20 pb-8" />
		<p class="text-3xl text-center">{queue_name}</p>

		<div class="py-6 px-4 flex flex-col justify-center">
			<p
				title="Queue ID"
				id="queue-id"
				class="cursor-default px-4 text-center bg-slate-100 dark:bg-slate-500 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 border-2 rounded-xl font-mono font-medium text-xl tracking-[0.2em] h-14 leading-[3.5rem]"
			>
				{$page.params.id}
			</p>

			<section>
				<h2 class="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">Share this Queue</h2>

				<ul class="mt-2">
					<li class="flex">
						<a href={whatsapp_url} target="_blank" class="flex items-center py-3 px-5 rounded-lg hover:bg-slate-100">
							<WhatsApp width={25} height={25} />
							<span class="ml-3">WhatsApp</span></a
						>
					</li>
					<li class="flex">
						<a href={sms_url} target="_blank" class="flex items-center py-3 px-5 rounded-lg hover:bg-slate-100">
							<Messages width={25} height={25} />
							<span class="ml-3">Messages</span></a
						>
					</li>

					<!-- bg-slate-400 rounded-xl p-3 block aspect-square w-14 h-14 -->

					<li class="flex">
						<button
							class="flex px-5 py-3 rounded-lg hover:bg-slate-100"
							on:click={() => navigator.clipboard.writeText(decodeURIComponent(encoded_text))}
						>
							<Files  class="w-full h-full slate-500" />
							<span class="ml-3">Copy</span>
						</button>
					</li>

					<!--
					<li>
					</li> -->
				</ul>
			</section>
		</div>
	</div>
</aside>
