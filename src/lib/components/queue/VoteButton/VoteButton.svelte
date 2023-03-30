<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';
	import { ThumbsDown, ThumbsUp } from 'lucide-svelte';

	const buttonVariants = cva(
		[
			'flex',
			'gap-1.5',
			'items-center',
			'justify-center',
			'rounded-full',
			'text-sm',
			'font-medium',
			'h-10',
			'w-16',
			'py-1',
			'px-3',
			'transition-colors',
			'shadow-md'
		],
		{
			variants: {
				has_voted: {
					false: [
						'bg-white',
						'text-slate-700',
						'hover:bg-slate-200',
						'dark:bg-slate-600',
						'dark:text-slate-100',
						'dark:hover:bg-slate-500'
					],
					true: ['bg-indigo-600', 'text-indigo-50', 'hover:bg-indigo-800', 'dark:hover:bg-indigo-500']
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
	<span>
		{#if vote_type === 'up'}
			<ThumbsUp size={16} />
		{:else}
			<ThumbsDown size={16} />
		{/if}
	</span>
	<span class="font-mono">
		{value}
	</span>
</button>
