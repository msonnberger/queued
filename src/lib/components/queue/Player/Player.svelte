<script lang="ts">
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { format_artists, ms_to_min_sec } from '$lib/utils';
	import { Pause, Play, SkipBack, SkipForward, Volume, Volume1, Volume2 } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import ProgressBar from './ProgressBar/ProgressBar.svelte';
	import toast from 'svelte-french-toast';

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
	}, 500);

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
</script>

<div class="fixed inset-x-0 bottom-0 z-10">
	<div
		class="flex items-center gap-6 bg-white/90 dark:bg-slate-800/90 pr-6 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm"
	>
		<div class="block aspect-square w-40 bg-slate-200">
			{#if $player_store.track?.album.images[0].url}
				<img src={$player_store.track.album.images[0].url} alt="Album cover" />
			{:else}
				<svg
					class="w-full h-full p-5"
					version="1.1"
					id="Capa_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 55.334 55.334"
					xml:space="preserve"
				>
					<g>
						<g>
							<circle class="fill-slate-400" cx="27.667" cy="27.667" r="3.618" />
							<path
								class="fill-slate-400"
								d="M27.667,0C12.387,0,0,12.387,0,27.667s12.387,27.667,27.667,27.667s27.667-12.387,27.667-27.667
			S42.947,0,27.667,0z M17.118,6.881c3.167-1.61,6.752-2.518,10.549-2.518c0.223,0,0.444,0.003,0.665,0.009
			c0.367,0.01,0.619,0.922,0.564,2.025l-0.282,5.677c-0.055,1.103-0.289,1.986-0.523,1.979c-0.141-0.004-0.282-0.006-0.424-0.006
			c-1.997,0-3.894,0.43-5.603,1.202c-1.007,0.455-2.212,0.184-2.774-0.767l-2.896-4.897C15.832,8.634,16.133,7.382,17.118,6.881z
			 M15.986,17.295l-4.278-3.742c-0.832-0.727-0.918-1.994-0.119-2.756c0.019-0.018,0.037-0.035,0.057-0.053
			c0.802-0.76,2.059-0.605,2.737,0.266l3.494,4.484c0.679,0.871,0.837,1.889,0.391,2.314C17.821,18.235,16.818,18.022,15.986,17.295
			z M17.877,27.667c0-5.407,4.383-9.79,9.79-9.79s9.79,4.383,9.79,9.79s-4.383,9.79-9.79,9.79S17.877,33.074,17.877,27.667z
			 M38.17,48.476c-3.156,1.596-6.725,2.495-10.503,2.495c-0.248,0-0.495-0.004-0.741-0.011c-0.409-0.013-0.692-0.929-0.632-2.032
			l0.31-5.676c0.061-1.103,0.322-1.981,0.586-1.972c0.158,0.005,0.317,0.008,0.477,0.008c1.834,0,3.582-0.362,5.179-1.018
			c1.022-0.42,2.275-0.144,2.877,0.782l3.101,4.77C39.426,46.747,39.156,47.977,38.17,48.476z M43.619,44.656
			c-0.766,0.72-2.005,0.551-2.703-0.305l-3.59-4.407c-0.698-0.856-0.876-1.848-0.435-2.255c0.442-0.407,1.443-0.179,2.274,0.549
			l4.28,3.744C44.277,42.709,44.386,43.936,43.619,44.656z"
							/>
						</g>
					</g>
				</svg>
			{/if}
		</div>
		<div class="flex flex-1 flex-col gap-4 overflow-hidden p-1">
			<div class="flex w-full justify-between items-center">
				<div class="flex w-full justify-between">
					<div class="flex flex-col">
						<span class="truncate text-base font-bold leading-6 ">{$player_store.track?.name ?? ''}</span>
						<span class="truncate text-sm font-normal text-slate-500 dark:text-slate-400"
							>{format_artists($player_store.track?.artists)}
						</span>
					</div>
					<button on:click={() => toast.error('Oops. Not implemented yet.', { position: 'bottom-center' })}>
						<SkipBack size={28} />
					</button>
				</div>

				<Button
					on:click={$player_store.track === null ? init_playback : () => player?.togglePlay()}
					disabled={$player_store.device_id === null}
					circle
					size="lg"
					class="mx-4"
				>
					{#if $player_store.is_playing}
						<Pause size={24} class="fill-white dark:fill-slate-900" strokeWidth="1" />
					{:else}
						<Play
							size={24}
							strokeWidth="1"
							class="fill-white dark:fill-slate-900 dark:stroke-slate-900 translate-x-0.5"
						/>
					{/if}
				</Button>
				<div class="w-full flex gap-4 items-center">
					<button on:click={() => toast.error('Oops. Not implemented yet.', { position: 'bottom-center' })}>
						<SkipForward size={28} />
					</button>
					<div class="flex gap-2">
						<label for="toggle_volume_slider" class="cursor-pointer">
							{#if $player_store.volume === 0}
								<Volume />
							{:else if $player_store.volume < 0.5}
								<Volume1 />
							{:else}
								<Volume2 />
							{/if}
						</label>
						<input type="checkbox" id="toggle_volume_slider" class="peer sr-only" />

						<input
							bind:value={$player_store.volume}
							on:change={() => player?.setVolume($player_store.volume)}
							type="range"
							name="volume"
							id="volume"
							min="0"
							max="1"
							step="0.01"
							class="accent-slate-900 dark:accent-slate-100 hidden peer-checked:block"
						/>
					</div>
				</div>
			</div>

			<div class="flex justify-between gap-4">
				<output
					class="block rounded-md py-0.5 tracking-wide font-mono text-sm leading-6 text-slate-500 dark:text-slate-400"
					>{ms_to_min_sec($player_store.position ?? 0)}</output
				>
				<ProgressBar progress={(($player_store.position ?? 0) / ($player_store.duration ?? 1)) * 100} />
				<span
					class="block rounded-md px-1 py-0.5 tracking-wide font-mono text-sm leading-6 text-slate-500 dark:text-slate-400"
					>{ms_to_min_sec($player_store.duration ?? 0)}</span
				>
			</div>
		</div>
	</div>
</div>
