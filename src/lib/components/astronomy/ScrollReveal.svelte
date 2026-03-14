<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		threshold?: number;
		delay?: number;
		class?: string;
		children: Snippet;
	}

	let { threshold = 0.15, delay = 0, class: className = '', children }: Props = $props();

	let wrapper: HTMLDivElement | undefined = $state();
	let revealed = $state(false);
	let reducedMotion = $state(false);

	$effect(() => {
		if (!browser) return;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		if (mq.matches) {
			revealed = true;
			return;
		}

		const handler = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
			if (e.matches) revealed = true;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || !wrapper || reducedMotion) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					if (delay > 0) {
						setTimeout(() => { revealed = true; }, delay);
					} else {
						revealed = true;
					}
					observer.unobserve(entry.target);
				}
			},
			{ threshold }
		);

		observer.observe(wrapper);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={wrapper}
	class="scroll-reveal {revealed ? 'revealed' : ''} {className}"
	style="contain: content;"
>
	{@render children()}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
		will-change: opacity, transform;
	}

	.scroll-reveal.revealed {
		opacity: 1;
		transform: translateY(0);
		will-change: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
