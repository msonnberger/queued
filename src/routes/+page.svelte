<script lang="ts">
	import { Button } from '$lib/components';
</script>

<svelte:head>
	<title>Queued</title>
</svelte:head>

<div class="grow grid place-items-center">
	<h1 class="text-5xl font-bold">Welcome to Queued</h1>
	<Button href="/queue/new">Create Queue</Button>
</div>
