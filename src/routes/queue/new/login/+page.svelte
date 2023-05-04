<script>
	import { Button } from '$lib/components';
</script>

<svelte:head>
	<title>Queued • New Queue</title>
</svelte:head>

<main class="w-full max-w-2xl px-4 lg:px-0 pt-10">
	<h1 class="text-5xl font-bold mb-10">Sign in to continue</h1>
	<p class="text-xl mb-10">To create your own Queue, you need to sign in with your Spotify Premium account.</p>
	<Button href="/auth/login?redirect_to=/queue/new">Continue with Spotify</Button>
</main>
