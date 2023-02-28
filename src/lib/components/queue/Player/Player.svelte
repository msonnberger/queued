<script lang="ts">
	import { postMePlayerQueue, putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { PlayerStore, QueueStore } from '$lib/types';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { format_artists } from '$lib/utils';
	import { Pause, Play } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let spotify_token: string;
	export let player_store: Writable<PlayerStore>;
	export let queue_tracks: QueueStore['tracks'];
	export let remove_track: QueueStore['remove_track'];

	let player: WebPlaybackPlayer | undefined;

	const interval = setInterval(async () => {
		const state = await player?.getCurrentState();
		$player_store.position = state?.position ?? null;
	}, 1000);

	$: {
		if (should_play_next && queue_tracks[0].uri && $player_store.device_id) {
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

				remove_track(queue_tracks[0].uri);
			} catch (error) {
				console.error(error);
			}
		}
	}

	$: should_play_next =
		$player_store.duration !== null &&
		$player_store.position !== null &&
		$player_store.duration - $player_store.position < 10000 &&
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

	const init_playback = async () => {
		if (queue_tracks[0].uri === undefined || $player_store.device_id === null) {
			return;
		}

		try {
			await putMePlayerPlay(
				{ uris: [queue_tracks[0].uri] },
				{ deviceId: $player_store.device_id },
				{
					headers: {
						Authorization: `Bearer ${spotify_token}`
					}
				}
			);

			remove_track(queue_tracks[0].uri);
			player?.togglePlay();
		} catch (error) {
			console.error(error);
		}
	};
</script>

<h2>Player</h2>
<div class="flex">
	{#if $player_store.track === null}
		<Button on:click={init_playback} disabled={queue_tracks.length === 0 || $player_store.device_id === null}>
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
