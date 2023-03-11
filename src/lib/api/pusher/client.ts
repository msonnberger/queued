import Pusher from 'pusher-js';

import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';

export const pusher_client = new Pusher(PUBLIC_PUSHER_KEY, {
	cluster: PUBLIC_PUSHER_CLUSTER,
	wsHost: 'ws.queued.live',
	wsPort: 80,
	wssPort: 443,
	enabledTransports: ['ws', 'wss'],
	forceTLS: true
});
