<script lang="ts">
	import { page } from '$app/stores';

	$: qid = $page.params.qid;
</script>

<img src={`/queue/${qid}/qrcode.svg`} alt="QR Code" />
