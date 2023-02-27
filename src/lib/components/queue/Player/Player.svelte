<script lang="ts">
	import { putMePlayerPlay } from '$lib/api/spotify';
	import { Button } from '$lib/components';
	import { onMount } from 'svelte';

	export let spotify_token: string;
	let player;
	let device_id;
	let is_playing = false;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		document.head.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			player = new Spotify.Player({
				name: 'Queued Player',
				getOAuthToken: (cb) => {
					cb(spotify_token);
				},
				volume: 0.5
			});

			player.addListener('ready', (state) => {
				device_id = state.device_id;
			});

			player.addListener('player_state_changed', (state) => {
				console.log(state);
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
