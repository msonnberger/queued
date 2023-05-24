<script lang="ts">
	import { Pause, Play, SkipBack, SkipForward, Volume, Volume1, Volume2 } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import default_theme from 'tailwindcss/defaultTheme';

	import { browser } from '$app/environment';
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import { Vinyl } from '$lib/components/icons';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { format_artists, ms_to_min_sec } from '$lib/utils';
	import ProgressBar from './ProgressBar/ProgressBar.svelte';

	export let player_store: Writable<PlayerStore>;
	export let queue_store: QueueStore;
	export let spotify_access_token: string;

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
				{ headers: { Authorization: `Bearer ${spotify_access_token}` } }
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
				getOAuthToken: (cb: SpotifyPlayerCallback) => cb(spotify_access_token),
				volume: $player_store.volume
			});

			if (!player) {
				return;
			}

			player.addListener('ready', (state) => {
				$player_store.device_id = state.device_id;
			});

			player.addListener('initialization_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('authentication_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('account_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('player_state_changed', (state) => {
				if (!state) {
					return;
				}

				const { position, duration, track_window, paused } = state;

				$player_store.position = position;
				$player_store.duration = duration;
				$player_store.is_playing = !paused;
				$player_store.track = track_window.current_track;

				// TODO: make this work again
				// if ($player_store.track?.uri === track_window.current_track.uri && paused && position === 0) {
				// 	$player_store.track = null;
				// 	queue_store.update_current_track(null);
				// } else {
				// }

				if ($player_store.track?.uri === $player_store.up_next_uri) {
					queue_store.delete_track($player_store.up_next_uri);
					queue_store.update_current_track($player_store.up_next_uri);
					$player_store.up_next_uri = null;
				}
			});

			player.connect();
		};
	});

	onDestroy(async () => {
		player?.disconnect();

		if (browser) {
			await queue_store.update_current_track(null);
		}
	});

	async function init_playback() {
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
				{ headers: { Authorization: `Bearer ${spotify_access_token}` } }
			);

			queue_store.delete_track(uri);
			queue_store.update_current_track(uri);

			player?.togglePlay();
		} catch (error) {
			console.error(error);
		}
	}

	$: player?.setVolume($player_store.volume);
</script>

<div
	class="fixed left-0 lg:left-sidebar right-0 bottom-0 z-10 h-24 sm:h-40 flex items-center gap-6 bg-white/90 dark:bg-slate-800/90 pr-6 ring-1 ring-slate-900/5 backdrop-blur-sm"
>
	<div class="block aspect-square w-24 sm:w-40 bg-slate-200 dark:bg-slate-700">
		{#if $player_store.track?.album.images[0].url}
			<img src={$player_store.track.album.images[0].url} alt="Album cover" width="100" height="100" />
		{:else}
			<Vinyl />
		{/if}
	</div>
	<div class="flex flex-1 flex-col gap-4 overflow-hidden">
		<div class="flex w-full justify-between items-center">
			<div class="flex sm:w-1/2 justify-between">
				<div class="flex flex-col sm:w-4/5">
					<span class="truncate text-base font-bold leading-6">{$player_store.track?.name ?? ''}</span>
					<span class="truncate text-sm font-normal text-slate-500 dark:text-slate-400"
						>{format_artists($player_store.track?.artists)}
					</span>
				</div>
				<button class="hidden sm:block" disabled={$player_store.track === null} on:click={() => player?.seek(0)}>
					<SkipBack size={28} />
				</button>
			</div>

			<Button
				on:click={$player_store.track === null ? init_playback : () => player?.togglePlay()}
				disabled={$player_store.device_id === null}
				circle
				size={browser && window.matchMedia(`screen and (min-width: ${default_theme.screens.sm}`).matches ? 'lg' : 'md'}
				class="sm:mx-4"
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
			<div class="hidden sm:w-1/2 sm:flex gap-4 items-center">
				<button disabled={$queue_store.tracks.length < 1} on:click={init_playback}>
					<SkipForward size={28} />
				</button>
				<div class="gap-2 flex">
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
				>-{ms_to_min_sec(($player_store.duration ?? 0) - ($player_store.position ?? 0))}</span
			>
		</div>
	</div>
</div>
