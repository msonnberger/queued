/* eslint-disable @typescript-eslint/no-explicit-any */

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
