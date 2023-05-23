<script lang="ts">
	export let href: string;

	$: external = href.startsWith('http');
</script>

<a
	{href}
	class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
	target={external ? '_blank' : ''}
	rel={external ? 'noopener noreferrer nofollow' : ''}><slot /></a
>
