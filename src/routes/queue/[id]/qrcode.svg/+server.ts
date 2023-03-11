import type { Config } from '@sveltejs/adapter-vercel';
import QRCode from 'qrcode';
import Colors from 'tailwindcss/colors';

import type { RequestHandler } from './$types';

export const config: Config = {
	runtime: 'edge',
	regions: 'all'
};

export const GET = (async ({ params, url }) => {
	const queue_url = new URL('/queue/' + params.id, url);
	const svg = await QRCode.toString(queue_url.href, {
		type: 'svg',
		errorCorrectionLevel: 'H',
		color: {
			dark: Colors.slate[900],
			light: '#00000000'
		}
	});
	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml',
			'cache-control': 'private, max-age=3600'
		}
	});
}) satisfies RequestHandler;
