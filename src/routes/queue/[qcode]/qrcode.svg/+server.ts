import type { RequestHandler } from './$types';
import QRCode from 'qrcode';

export const GET = (async ({ params, url }) => {
	const queue_url = new URL('/queue/' + params.qcode, url);
	const svg = await QRCode.toString(queue_url.toString(), { type: 'svg', errorCorrectionLevel: 'H' });
	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml',
			'cache-control': 'private, max-age=3600'
		}
	});
}) satisfies RequestHandler;
