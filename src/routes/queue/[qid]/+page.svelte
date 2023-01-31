<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	$: ({ qid } = $page.params);
	$: ({ queue } = data);

	export let data: PageData;
</script>

<h1>{$queue.name}</h1>
<img src={`/queue/${qid}/qrcode.svg`} alt="QR Code" class="w-80" />
