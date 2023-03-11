/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ArtistObject } from '$lib/api/spotify';
import type { QueueStore } from './types';

export const debounce = <Params extends any[]>(
	func: (...args: Params) => any,
	timeout: number
): ((...args: Params) => void) => {
	let timer: NodeJS.Timeout;
	return (...args: Params) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
};

export const sorted_queue = (queue: QueueStore) => {
	const sorted = [...queue.tracks];
	sorted.sort((a, b) => {
		const diff = b.votes.up + b.votes.down - (a.votes.up + a.votes.down);

		if (diff === 0) {
			return b.votes.up - a.votes.up;
		}

		return diff;
	});

	queue.tracks = sorted;

	return queue;
};

export const format_artists = (artists: ArtistObject[] | undefined) => {
	if (artists === undefined) {
		return '';
	}

	return artists
		.map((artist) => artist.name)
		.filter(Boolean)
		.join(' & ');
};

export const ms_to_min_sec = (ms: number) => {
	const min = Math.floor(ms / (1000 * 60));
	const sec = ((ms % 60000) / 1000).toFixed(0);

	return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
