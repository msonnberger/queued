export async function load({ data, params }) {
	return { user: data.user, qid: params.id };
}
