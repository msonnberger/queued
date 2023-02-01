import type { RequestHandler } from './$types';
import QRCode from 'qrcode';

export const GET = (async ({ params, url }) => {
	const queue_url = new URL('/queue/' + params.qid, url);
	const svg = await QRCode.toString(queue_url.href, {
		type: 'svg',
		errorCorrectionLevel: 'H',
		color: {
			dark: '#0f172a',
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
