<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	import * as spotify_api from '$lib/api/spotify';
	import { ThemeToggle, UserMenu } from '$lib/components';
	import { spotify_tokens } from '$lib/stores';

	onMount(() => {
		spotify_api.defaults.fetch = async (...args) => {
			const [resource, config] = args;
			let response = await fetch(resource, config);

			if (response.status === 401) {
				const new_token_res = await fetch('/api/spotify-access-token', {
					method: 'POST',
					body: JSON.stringify({ refresh_token: $spotify_tokens.refresh_token })
				});

				if (!new_token_res.ok) {
					return Promise.reject(new_token_res);
				}

				$spotify_tokens.access_token = await new_token_res.text();
				response = await fetch(resource, config);
			}

			return response;
		};
	});

	$: {
		$spotify_tokens.access_token = data.session?.provider_token ?? $spotify_tokens.access_token;
		$spotify_tokens.refresh_token = data.session?.provider_refresh_token ?? $spotify_tokens.refresh_token;
	}

	$: {
		if ($spotify_tokens.access_token) {
			spotify_api.defaults.headers = {
				Authorization: `Bearer ${$spotify_tokens.access_token}`
			};
		}
	}

	export let data;
</script>

<Toaster />
<header class="self-end p-4 flex gap-5">
	<ThemeToggle />
	<UserMenu session={data.session} />
</header>
<slot />
