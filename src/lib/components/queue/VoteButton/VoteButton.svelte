<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import { ThumbsDown, ThumbsUp } from 'lucide-svelte';

	const buttonVariants = cva(
		[
			'inline-flex',
			'items-center',
			'justify-center',
			'rounded-full',
			'text-sm',
			'font-medium',
			'h-10',
			'py-1',
			'px-3',
			'transition-colors',
			'shadow-md'
		],
		{
			variants: {
				has_voted: {
					false: [
						'bg-slate-900',
						'text-slate-50',
						'hover:bg-slate-800',
						'dark:bg-slate-50',
						'dark:text-slate-900',
						'dark:hover:bg-slate-200'
					],
					true: ['bg-indigo-600', 'text-indigo-50', 'hover:bg-indigo-800']
				}
			},
			defaultVariants: {
				has_voted: false
			}
		}
	);

	type ButtonProps = VariantProps<typeof buttonVariants>;

	export let has_voted: ButtonProps['has_voted'] = false;
	export let vote_type: 'up' | 'down';
	export let value: number;
</script>

<button type="button" class={buttonVariants({ has_voted })} on:click>
	<span class="mr-1">
		{#if vote_type === 'up'}
			<ThumbsUp size={16} />
		{:else}
			<ThumbsDown size={16} />
		{/if}
	</span>
	{value}
</button>
