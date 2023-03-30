import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { session } = await parent();

	if (session) {
		throw redirect(303, '/queue/new');
	}
}
