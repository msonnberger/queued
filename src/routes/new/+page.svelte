<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>NEW</h1>
{#if data.user_has_premium}
	<h2>HAS PREMIUM</h2>
{:else}
	<h2>HAS NO PREMIUM</h2>
{/if}
