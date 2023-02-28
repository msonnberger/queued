<script lang="ts">
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let spotify_token: string;
	export let player_store: Writable<PlayerStore>;
	export let queue_tracks: QueueStore['tracks'];

	let player: WebPlaybackPlayer | undefined;

	$: player && player.setVolume($player_store.volume);

	$: {
		if (should_play_next && queue_tracks[0].uri && $player_store.device_id) {
			console.log(queue_tracks[0]);

			try {
				postMePlayerQueue(
					queue_tracks[0].uri,
					{ deviceId: $player_store.device_id },
					{
						headers: {
							Authorization: `Bearer ${spotify_token}`
						}
					}
				);
			} catch (error) {
				console.error(error);
			}
		}
	}

	$: should_play_next =
		($player_store.track === null ||
			($player_store.duration !== null &&
				$player_store.position !== null &&
				$player_store.duration - $player_store.position < 10000)) &&
		queue_tracks.length > 0;

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

				$player_store.position = state.position;
				$player_store.duration = state.duration;
				$player_store.track = state.track_window.current_track;
				$player_store.is_playing = !state.paused;
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
</script>

<h2>Player</h2>
<Button
	on:click={() =>
		putMePlayerPlay(
			{ uris: ['spotify:track:4P0osvTXoSYZZC2n8IFH3c'] },
			{ deviceId: $player_store.device_id ?? undefined },
			{
				headers: {
					Authorization: `Bearer ${spotify_token}`
				}
			}
		)}>Play Payphone</Button
>
<Button on:click={() => player && player.togglePlay()}>{$player_store.is_playing ? 'Pause' : 'Play'}</Button>
<input bind:value={$player_store.volume} type="range" name="volume" id="volume" min="0" max="1" step="0.01" />
<label for="volume">Volume</label>
