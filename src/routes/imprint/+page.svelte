<script>
	import { Link } from '$lib/components';
</script>

<svelte:head>
	<title>Queued • Imprint</title>
</svelte:head>

<main class="w-full max-w-2xl mb-20 mt-10 text-lg">
	<h1 class="font-bold text-6xl mt-4 mb-8">Imprint</h1>
	<h2 class="italic text-slate-500 dark:text-slate-400 text-xl mb-8">
		Disclosure and information obligation pursuant to §25&nbsp;Mediengesetz and §5&nbsp;E-Commerce-Gesetz.
	</h2>
	<p>
		Queued was created as a part of the MutliMediaTechnology degree program at Salzburg University of Applied Sciences.
		If you want to find out more about that program, click
		<Link href="https://www.fh-salzburg.ac.at/en/study/ct/multimediatechnology-bachelor">here</Link>.
	</p>
	<p class="mt-3">
		To contact us, leave us a message at <Link href="mailto:contact@queued.live">contact@queued.live</Link>.
	</p>
	<p class="my-6">
		<span class="font-semibold">Salzburg University of Applied Sciences</span><br />
		Urstein Süd 1<br />
		5412 Puch bei Hallein <br />Austria
	</p>

	<h2 class="font-bold text-3xl mt-6 mb-4">Meet the Team</h2>
	<ul class="list-disc list-inside flex flex-col gap-1">
		<li>
			<Link href="https://github.com/msonnberger">Martin Sonnberger</Link> (Concept & Development)
		</li>
		<li>Maximilian Hajek (Concept & Development)</li>
		<li>Simon Hagn (Interface Design)</li>
	</ul>
</main>
