<script>
	import { Link } from '$lib/components';
</script>

<svelte:head>
	<title>Queued • Imprint</title>
</svelte:head>

<main class="w-full max-w-2xl px-5 lg:px-0 mb-20 mt-10 text-lg">
	<h1 class="font-bold text-5xl lg:text-6xl mt-4 mb-8">Imprint</h1>
	<h2 class="italic text-slate-500 dark:text-slate-400 text-xl mb-8">
		Disclosure and information obligation pursuant to §25&nbsp;Mediengesetz and §5&nbsp;E-Commerce-Gesetz.
	</h2>
	<p class="mt-3">
		<span class="font-semibold">FH Salzburg</span><br />
		Urstein Süd 1<br />
		5412 Puch bei Hallein, Austria
	</p>
	<p class="mt-3">
		To contact us, leave us a message at <Link href="mailto:contact@queued.live">contact@queued.live</Link>.
	</p>
	<h2 class="font-bold text-2xl mt-10 mb-4">Meet the Team</h2>
	<ul class="list-disc list-inside flex flex-col gap-1">
		<li>
			<Link href="https://github.com/msonnberger">Martin Sonnberger</Link> (Interface Design, Concept & Development)
		</li>
		<li><Link href="https://github.com/Bluuax">Maximilian Hajek</Link> (Interface Design, Concept & Development)</li>
	</ul>
</main>
