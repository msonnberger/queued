import QRCode from 'qrcode';
import Colors from 'tailwindcss/colors';

export const config = {
	runtime: 'edge',
	regions: 'all'
};

export async function GET({ params, url }) {
	const queue_url = new URL('/queue/' + params.id, url);
	const svg = await QRCode.toString(queue_url.href, {
		type: 'svg',
		errorCorrectionLevel: 'H',
		margin: 0,
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
}
