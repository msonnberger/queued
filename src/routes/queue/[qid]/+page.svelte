<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { debounce } from '$lib/utils';
	import { Button } from '$lib/components';
	import type { TrackObject } from '$lib/api/spotify';

	$: ({ qid } = $page.params);
	$: ({ queue } = data);

	export let data: PageData;
	let tracks: TrackObject[] = [];

	$: console.log($queue);

	const handle_change = debounce(async (e: Event) => {
		const input = e.target as HTMLInputElement;

		if (input.value.length <= 3) {
			return;
		}

		const res = await fetch(`/api/search?q=${input.value}`);
		tracks = (await res.json()) as TrackObject[];
	}, 300);
</script>

<h1>{$queue.name}</h1>
<img src={`/queue/${qid}/qrcode.svg`} alt="QR Code" class="w-80" />
<input type="text" name="" id="" on:input={handle_change} class="border border-slate-900" />
<ul>
	{#each tracks as { name, album, uri }}
		<li>
			<form action="?/add_track" method="post">
				<label for="spotify_uri">{name} - {album?.name}</label>
				<input type="hidden" name="spotify_uri" value={uri} />
				<input type="hidden" name="queue_id" value={$queue.id} />
				<Button type="submit">Add</Button>
			</form>
		</li>
	{/each}
</ul>
