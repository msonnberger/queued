<script>
	import { Button } from '$lib/components';
</script>

<p>Wall of text - you need Spotify Premium to create a Queue</p>
<form action="/auth/login?path=queue/new" method="post">
	<Button type="submit">Continue with Spotify</Button>
</form>
