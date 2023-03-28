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



			<div class="flex gap-3 mt-3 items-start h-min justify-between">
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
</aside>
