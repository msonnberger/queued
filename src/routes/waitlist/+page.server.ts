export const actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		const { error: err } = await locals.supabase_admin.from('waitlist').insert({ email });

		return { success: !err };
	}
};
