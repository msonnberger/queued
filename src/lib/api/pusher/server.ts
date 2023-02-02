import { PUSHER_SECRET } from '$env/static/private';
import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher';

export const pusher = new Pusher({
	appId: 'queued',
	key: PUBLIC_PUSHER_KEY,
	secret: PUSHER_SECRET,
	cluster: PUBLIC_PUSHER_CLUSTER,
	host: 'ws.queued.live',
	port: '443',
	useTLS: true
});
