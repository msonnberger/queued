import { create_player_store, create_queue_store } from '$lib/stores';

export async function load({ data }) {
	const { store_queue, voter_id, access_token } = data;

	return {
		queue: create_queue_store(store_queue, voter_id),
		player: create_player_store(),
		access_token
	};
}
