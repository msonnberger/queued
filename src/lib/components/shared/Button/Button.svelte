<script lang="ts">
	import { type VariantProps, cva } from 'class-variance-authority';
	const buttonVariants = cva(
		[
			'inline-flex',
			'items-center',
			'justify-center',
			'rounded-md',
			'text-sm',
			'font-medium',
			'h-10',
			'py-2',
			'px-4',
			'transition-colors'
		],
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
						'border',
						'bg-transparent',
						'border-slate-900',
						'text-slate-900',
						'hover:bg-slate-100',
						'dark:text-slate-50',
						'dark:border-slate-50',
						'dark:hover:bg-slate-800'
					]
				}
			},
			defaultVariants: {
				variant: 'filled'
			}
		}
	);

	type ButtonProps = VariantProps<typeof buttonVariants>;

	export let variant: ButtonProps['variant'] = 'filled';
	export let href: string | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let external = false;

	$: target = external ? '_blank' : '';
	$: rel = external ? 'noopener noreferrer' : '';
</script>

{#if href}
	<a {href} class={buttonVariants({ variant })} {target} {rel}><slot /></a>
{:else}
	<button {type} class={buttonVariants({ variant })} on:click><slot /></button>
{/if}
