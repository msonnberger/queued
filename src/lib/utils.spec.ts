import type { Queue } from './types';
import { debounce, format_artists, get_focusable_elements, ms_to_min_sec, sorted_queue } from './utils';

test('ms_to_min_sec', () => {
	expect(ms_to_min_sec(0)).toEqual('00:00');
	expect(ms_to_min_sec(499)).toEqual('00:00');
	expect(ms_to_min_sec(500)).toEqual('00:01');
	expect(ms_to_min_sec(1000)).toEqual('00:01');
	expect(ms_to_min_sec(1000.5)).toEqual('00:01');
	expect(ms_to_min_sec(60000)).toEqual('01:00');
	expect(ms_to_min_sec(1000 * 60 * 59 + 1000 * 59)).toEqual('59:59');
	expect(ms_to_min_sec(1000 * 60 * 59 + 1000 * 60)).toEqual('60:00');
	expect(ms_to_min_sec(1000 * 60 * 999)).toEqual('999:00');

	expect(() => ms_to_min_sec(-1)).toThrow('`ms` must be positive.');
});

test('format_artists', () => {
	expect(format_artists(undefined)).toEqual('');
	expect(format_artists([])).toEqual('');
	expect(format_artists([{}])).toEqual('');
	expect(format_artists([{ name: 'foo' }])).toEqual('foo');
	expect(format_artists([{ name: 'foo' }, { name: 'bar' }])).toEqual('foo & bar');
	expect(
		format_artists([{ name: 'first' }, { name: undefined }, { name: 'second' }, { name: '' }, { name: 'third' }])
	).toEqual('first & second & third');
});

test('sorted_queue', () => {
	const queue: Queue = {
		name: '',
		id: '',
		owner_id: '',
		tracks: []
	};

	expect(sorted_queue(queue)).toEqual(queue);

	queue.tracks = [
		{ db_id: 1, votes: { up: 1, down: 0, own_vote: null } },
		{ db_id: 2, votes: { up: 2, down: 0, own_vote: null } },
		{ db_id: 3, votes: { up: 3, down: 0, own_vote: null } }
	];

	expect(sorted_queue(queue).tracks.map((t) => t.db_id)).toEqual([3, 2, 1]);

	queue.tracks = [
		{ db_id: 1, votes: { up: 0, down: -3, own_vote: null } },
		{ db_id: 2, votes: { up: 0, down: -2, own_vote: null } },
		{ db_id: 3, votes: { up: 0, down: -1, own_vote: null } }
	];

	expect(sorted_queue(queue).tracks.map((t) => t.db_id)).toEqual([3, 2, 1]);

	queue.tracks = [
		{ db_id: 1, votes: { up: 2, down: 0, own_vote: null } },
		{ db_id: 2, votes: { up: 3, down: -1, own_vote: null } },
		{ db_id: 3, votes: { up: 5, down: 0, own_vote: null } }
	];

	expect(sorted_queue(queue).tracks.map((t) => t.db_id)).toEqual([3, 2, 1]);
});

test('debounce', async () => {
	let executed = false;

	const debounced = debounce(() => {
		executed = true;
	}, 50);

	expect(debounced).toBeTypeOf('function');
	debounced();
	expect(executed).toBeFalsy();
	await new Promise((resolve) => setTimeout(resolve, 100));
	expect(executed).toBeTruthy();
});

describe('get_focusable_elements', () => {
	test('<a> with href is focusable', () => {
		const el = document.createElement('a');
		el.href = 'example.com';
		document.body.appendChild(el);
		expect(get_focusable_elements()).toContain(el);
	});

	test('<a> without href is not focusable', () => {
		const el = document.createElement('a');
		document.body.appendChild(el);
		expect(get_focusable_elements()).not.toContain(el);
	});
});
