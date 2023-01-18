import { render, screen, fireEvent } from '@testing-library/svelte';
import Counter from './Counter.svelte';

test('Counter increments when the button is clicked', async () => {
	render(Counter);

	expect(screen.getByText('Count: 0')).toBeInTheDocument();

	await fireEvent.click(screen.getByText('Increment'));

	expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
