<script lang="ts">
	import { putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import type { SpotifyPlayerCallback, WebPlaybackPlayer } from '$lib/types/web-player';
	import { onMount } from 'svelte';

	export let spotify_token: string;
	let player: WebPlaybackPlayer;
	let device_id: string;
	let is_playing = false;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		document.head.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			player = new window.Spotify.Player({
				name: 'Queued Web Player',
				getOAuthToken: (cb: SpotifyPlayerCallback) => cb(spotify_token),
				volume: 0.5
			});

			player.addListener('ready', (state) => {
				device_id = state.device_id;
			});

			player.addListener('player_state_changed', (state) => {
				if (!state) {
					return;
				}

				is_playing = !state.paused;
			});

			player.connect();
		};

		window.onkeydown = (event) => {
			if (event.key === ' ') {
				player.togglePlay();
			}
		};
	});
</script>

<h2>Player</h2>
<Button
	on:click={() =>
		putMePlayerPlay(
			{ uris: ['spotify:track:4P0osvTXoSYZZC2n8IFH3c'] },
			{ deviceId: device_id },
			{
				headers: {
					Authorization: `Bearer ${spotify_token}`
				}
			}
		)}>Play I Gotta Feeling</Button
>
<Button on:click={() => player.togglePlay()}>{is_playing ? 'Pause' : 'Play'}</Button>
