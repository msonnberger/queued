<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-auto items-center justify-center text-center px-4 flex-col sm:flex-row">
	<h1
		class="text-2xl sm:text-3xl font-extrabold sm:pr-6 sm:mr-6 sm:border-r sm:border-slate-900/10 sm:dark:border-slate-300/10"
	>
		{$page.status}
	</h1>
	<h2 class="mt-2 text-lg text-slate-700 dark:text-slate-400 sm:mt-0">{$page.error?.message}</h2>
</div>
