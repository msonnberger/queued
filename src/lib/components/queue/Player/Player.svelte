<script lang="ts">
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { format_artists, ms_to_min_sec } from '$lib/utils';
	import { Pause, Play } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import ProgressBar from './ProgressBar/ProgressBar.svelte';

	export let spotify_token: string;
	export let player_store: Writable<PlayerStore>;
	export let queue_store: Readable<QueueStore>;

	let player: WebPlaybackPlayer | undefined;

	// TODO: pause interval on player pause
	setInterval(async () => {
		const state = await player?.getCurrentState();
		const volume = await player?.getVolume();
		if (!state) {
			return;
		}

		const { position, duration } = state;

		$player_store.position = position;
		$player_store.duration = duration;

		if (volume !== undefined) {
			$player_store.volume = volume;
		}

		if (
			$player_store.duration - $player_store.position > 10000 ||
			$queue_store.tracks.length === 0 ||
			$player_store.device_id === null ||
			$player_store.up_next_uri !== null
		) {
			return;
		}

		const uri = $queue_store.tracks[0].uri;

		if (uri === undefined) {
			return;
		}

		try {
			postMePlayerQueue(
				uri,
				{ deviceId: $player_store.device_id },
				{
					headers: {
						Authorization: `Bearer ${spotify_token}`
					}
				}
			);

			$player_store.up_next_uri = uri;
		} catch (error) {
			console.error(error);
		}
	}, 1000);

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		document.head.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			player = new window.Spotify.Player({
				name: 'Queued Web Player',
				getOAuthToken: (cb: SpotifyPlayerCallback) => cb(spotify_token),
				volume: $player_store.volume
			});

			if (!player) {
				return;
			}

			player.addListener('ready', (state) => {
				$player_store.device_id = state.device_id;
			});

			player.addListener('player_state_changed', (state) => {
				if (!state) {
					return;
				}

				const { position, duration, track_window, paused } = state;

				$player_store.position = position;
				$player_store.duration = duration;
				$player_store.track = track_window.current_track;
				$player_store.is_playing = !paused;

				if ($player_store.track.uri === $player_store.up_next_uri) {
					$queue_store.remove_track($player_store.up_next_uri);
					$player_store.up_next_uri = null;
				}
			});

			player.connect();
		};

		window.onkeydown = (event) => {
			if (event.key === ' ' && player) {
				player.togglePlay();
			}
		};
	});

	onDestroy(() => player?.disconnect());

	const init_playback = async () => {
		if ($queue_store.tracks.length === 0) {
			return;
		}

		const uri = $queue_store.tracks[0].uri;

		if (uri === undefined || $player_store.device_id === null) {
			return;
		}

		try {
			await putMePlayerPlay(
				{ uris: [uri] },
				{ deviceId: $player_store.device_id },
				{
					headers: {
						Authorization: `Bearer ${spotify_token}`
					}
				}
			);

			$queue_store.remove_track(uri);
			player?.togglePlay();
		} catch (error) {
			console.error(error);
		}
	};

	$: progress = (($player_store.position ?? 0) / ($player_store.duration ?? 1)) * 100;
</script>

<h2>Player</h2>
<div class="flex">
	<input
		bind:value={$player_store.volume}
		on:change={() => player?.setVolume($player_store.volume)}
		type="range"
		name="volume"
		id="volume"
		min="0"
		max="1"
		step="0.01"
	/>
	<label for="volume">Volume</label>
</div>
<!-- <ProgressBar progress_percentage={($player_store.position / $player_store.duration) * 100} /> -->

<div class="fixed inset-x-0 bottom-0 z-10 lg:left-112 xl:left-120">
	<div
		class="flex items-center gap-6 bg-white/90  pr-6 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm "
	>
		<div class="block aspect-square w-40 bg-indigo-200" />
		<div class="flex flex-1 flex-col gap-3 overflow-hidden p-1">
			<div class="flex w-full justify-between">
				<div class="flex flex-col w-full">
					<span class="truncate text-center text-sm font-bold leading-6 md:text-left"
						>{$player_store.track?.name ?? ''}</span
					>
					<span class="truncate text-center text-sm font-normal text-slate-500 md:text-left"
						>{format_artists($player_store.track?.artists)}
					</span>
				</div>

				<Button
					on:click={$player_store.track === null ? init_playback : () => player && player.togglePlay()}
					disabled={$player_store.device_id === null}
					circle
					size="lg"
				>
					{#if $player_store.is_playing}
						<Pause size={24} fill="white" strokeWidth="1" />
					{:else}
						<Play size={24} fill="#fff" strokeWidth="1" class="translate-x-0.5" />
					{/if}
				</Button>
				<div class="w-full" />
			</div>

			<div class="flex justify-between gap-4">
				<output
					for="react-aria9214282547-2-0"
					aria-live="off"
					class="hidden rounded-md py-0.5 tracking-wide font-mono text-sm leading-6 md:block text-slate-500"
					>{ms_to_min_sec($player_store.position ?? 0)}</output
				>
				<div
					role="group"
					id="react-aria9214282547-1"
					aria-labelledby="react-aria9214282547-2"
					class="absolute inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6 md:relative"
				>
					<label class="sr-only" id="react-aria9214282547-2">Current time</label>
					<div class="relative w-full bg-slate-100 md:rounded-full" style="position: relative; touch-action: none;">
						<div class="h-2 md:rounded-r-md md:rounded-l-xl bg-slate-900" style="width: calc({progress}% - 0.25rem);" />
						<div class="absolute top-1/2 -translate-x-1/2" style="left: {progress}%;">
							<div
								class="h-4 rounded-full w-1 bg-slate-900"
								style="position: absolute; transform: translate(-50%, -50%); touch-action: none; left: {progress}%;"
							>
								<div
									style="border: 0px; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(50%); height: 1px; margin: 0px -1px -1px 0px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap;"
								>
									<input
										tabindex="0"
										id="react-aria9214282547-2-0"
										aria-labelledby="react-aria9214282547-2"
										type="range"
										min="0"
										max="64"
										step="1"
										aria-orientation="horizontal"
										aria-valuetext="0 hours, 0 minutes, 10 seconds"
										value="10"
									/>
								</div>
							</div>
						</div>
					</div>

					<span class="hidden rounded-md px-1 py-0.5 tracking-wide font-mono text-sm leading-6 text-slate-500 md:block"
						>{ms_to_min_sec($player_store.duration ?? 0)}</span
					>
				</div>
			</div>
		</div>
	</div>
</div>
