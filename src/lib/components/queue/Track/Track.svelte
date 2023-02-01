<script lang="ts">
	export let id: number;
	export let uri: string | undefined;
	export let title = '';
	export let artist = '';
	export let duration = 0;
	export let upvotes = 0;
	export let downvotes = 0;
	export let cover_art_url: string | undefined = undefined;
</script>

<div class="flex gap-3">
	<div>
		<p>{title}</p>
		<p>{artist}</p>
	</div>
	<strong>{upvotes} - {downvotes}</strong>
	{id}
	{uri}
	{duration}
	{cover_art_url}
</div>
