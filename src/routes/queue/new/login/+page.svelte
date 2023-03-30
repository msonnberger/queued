<script>
	import { Button } from '$lib/components';
</script>

<main class="w-full max-w-2xl pt-10">
	<h1 class="text-5xl font-bold mb-10">Sign in to continue</h1>
	<p class="text-xl mb-10">To create your own Queue, you need to sign in with your Spotify Premium account.</p>
	<form action="/auth/login?path=queue/new" method="post">
		<Button type="submit">Continue with Spotify</Button>
	</form>
</main>
