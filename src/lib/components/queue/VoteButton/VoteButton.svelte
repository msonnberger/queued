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
					true: [],
					false: [
						'bg-white',
						'text-slate-700',
						'hover:bg-slate-200',
						'dark:bg-slate-600',
						'dark:text-slate-100',
						'dark:hover:bg-slate-500'
					]
				},
				vote_type: {
					up: [],
					down: []
				}
			},
			defaultVariants: {
				has_voted: false
			},
			compoundVariants: [
				{
					has_voted: true,
					vote_type: 'up',
					class: ['bg-indigo-600', 'text-indigo-50', 'hover:bg-indigo-800', 'dark:hover:bg-indigo-500']
				},
				{
					has_voted: true,
					vote_type: 'down',
					class: ['bg-orange-600', 'text-orange-50', 'hover:bg-orange-800', 'dark:hover:bg-orange-500']
				}
			]
		}
	);

	type ButtonProps = VariantProps<typeof buttonVariants>;

	export let has_voted: ButtonProps['has_voted'] = false;
	export let vote_type: ButtonProps['vote_type'];
	export let value: number;
</script>

<button type="button" class={buttonVariants({ has_voted, vote_type })} on:click data-testid="{vote_type}vote">
	<span>
		{#if vote_type === 'up'}
			<ThumbsUp size={16} />
		{:else}
			<ThumbsDown size={16} />
		{/if}
	</span>
	<span class="font-mono" data-testid="vote-value">
		{value}
	</span>
</button>
