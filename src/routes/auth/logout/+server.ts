import { error, redirect } from '@sveltejs/kit';

export async function POST({ locals }) {
	const { error: err } = await locals.supabase.auth.signOut();

	if (err) {
		throw error(500, 'Something went wrong. Please try again later.');
	}

	throw redirect(303, '/');
}
