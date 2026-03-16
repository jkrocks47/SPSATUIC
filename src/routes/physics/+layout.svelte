<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';
	import PhysicsNav from '$lib/components/physics/PhysicsNav.svelte';
	import PhysicsFooter from '$lib/components/physics/PhysicsFooter.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let dark = $state(false);

	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem('physics-dark-mode');
		if (stored === 'true') {
			dark = true;
		} else if (stored === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			dark = true;
		}
	});

	function toggleDark() {
		dark = !dark;
		if (browser) {
			localStorage.setItem('physics-dark-mode', String(dark));
		}
	}
</script>

<div class="physics-theme bg-physics-light text-physics-dark min-h-screen transition-colors duration-300" class:dark>
	<PhysicsNav {dark} {toggleDark} />

	<main class="pt-16">
		{@render children()}
	</main>

	<PhysicsFooter />
</div>
