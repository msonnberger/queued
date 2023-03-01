<script lang="ts">
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { format_artists } from '$lib/utils';
	import { Pause, Play } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';

	export let spotify_token: string;
	export let player_store: Writable<PlayerStore>;
	export let queue_store: Readable<QueueStore>;

	let player: WebPlaybackPlayer | undefined;
	let up_next_uri: string | null = null;

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
			up_next_uri !== null
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

			up_next_uri = uri;
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

				if ($player_store.track.uri === up_next_uri) {
					$queue_store.remove_track(up_next_uri);
					up_next_uri = null;
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

<h2>Player</h2>
Up Next: {up_next_uri}
<div class="flex">
	{#if $player_store.track === null}
		<Button on:click={init_playback} disabled={$queue_store.tracks.length === 0 || $player_store.device_id === null}>
			Init
		</Button>
	{:else}
		<Button on:click={() => player && player.togglePlay()} circle size="lg">
			{#if $player_store.is_playing}
				<Pause size={24} fill="white" strokeWidth="1" />
			{:else}
				<Play size={24} fill="#fff" strokeWidth="1" class="translate-x-0.5" />
			{/if}
		</Button>
		<div>
			<strong>{$player_store.track?.name}</strong>
			{format_artists($player_store.track?.artists)}
		</div>
	{/if}

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
