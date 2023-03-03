<script lang="ts">
	import { Button } from '$lib/components';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>NEW</h1>
{#if data.user_has_premium}
	<form action="?/create_queue" method="post" class="flex flex-col gap-5">
		<label for="room_name">Queue name</label>
		<input type="text" name="queue_name" id="queue_name" class="border-2 border-slate-900 rounded-md" />
		<Button type="submit">Create Queue</Button>
	</form>
{:else}
	<h2>HAS NO PREMIUM</h2>
{/if}
