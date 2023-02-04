<script lang="ts">
	import { type VariantProps, cva } from 'class-variance-authority';
	const buttonVariants = cva(
		['inline-flex', 'items-center', 'justify-center', 'rounded-md', 'font-medium', 'transition-colors'],
		{
			variants: {
				variant: {
					filled: [
						'bg-slate-900',
						'text-slate-50',
						'hover:bg-slate-800',
						'dark:bg-slate-50',
						'dark:text-slate-900',
						'dark:hover:bg-slate-200'
					],
					outline: [
						'border-2',
						'bg-slate-50',
						'border-slate-900',
						'text-slate-900',
						'hover:bg-slate-100',
						'dark:text-slate-900',
						'dark:border-slate-50',
						'dark:hover:bg-slate-800'
					]
				},
				circle: {
					true: ['rounded-full'],
					false: ['rounded-md']
				},
				size: {
					sm: ['h-8', 'px-3', 'py-1', 'text-xs'],
					md: ['h-10', 'px-4', 'py-2', 'text-sm'],
					lg: ['h-12', 'px-6', 'py-3', 'text-base']
				}
			},
			defaultVariants: {
				variant: 'filled',
				circle: false,
				size: 'md'
			},
			compoundVariants: [
				{
					circle: true,
					size: 'sm',
					class: ['w-8', 'p-1']
				},
				{
					circle: true,
					size: 'md',
					class: ['w-10', 'p-2']
				},
				{
					circle: true,
					size: 'lg',
					class: ['w-12', 'p-3']
				}
			]
		}
	);

	type ButtonProps = VariantProps<typeof buttonVariants>;

	export let variant: ButtonProps['variant'] = 'filled';
	export let circle: ButtonProps['circle'] = false;
	export let size: ButtonProps['size'] = 'md';
	export let href: string | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let external = false;
	export let disabled = false;
	let klass = '';
	export { klass as class };

	$: target = external ? '_blank' : '';
	$: rel = external ? 'noopener noreferrer' : '';
</script>

{#if href}
	<a
		{href}
		class:pointer-events-none={disabled}
		class="{buttonVariants({ variant, circle, size })} {klass}"
		{target}
		{rel}><slot /></a
	>
{:else}
	<button {type} {disabled} class="{buttonVariants({ variant, circle, size })} {klass}" on:click><slot /></button>
{/if}
