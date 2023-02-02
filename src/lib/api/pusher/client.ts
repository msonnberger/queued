import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher-js';

export const pusher_client = new Pusher(PUBLIC_PUSHER_KEY, {
	cluster: PUBLIC_PUSHER_CLUSTER
});
