<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		count?: number;
		color?: string;
		speed?: number;
	}

	let { count = 30, color = 'rgba(79, 70, 229, 0.3)', speed = 0.3 }: Props = $props();

	interface Particle {
		x: number;
		y: number;
		size: number;
		opacity: number;
		speed: number;
		wobbleOffset: number;
		wobbleSpeed: number;
	}

	let canvas: HTMLCanvasElement | undefined = $state();
	let isVisible = $state(true);
	let reducedMotion = $state(false);

	$effect(() => {
		if (!browser) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || !canvas) return;
		const observer = new IntersectionObserver(
			([entry]) => { isVisible = entry.isIntersecting; },
			{ threshold: 0 }
		);
		observer.observe(canvas);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!browser || !canvas || reducedMotion) return;
		if (window.innerWidth < 768) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resize = () => {
			const parent = canvas!.parentElement;
			if (parent) {
				canvas!.width = parent.clientWidth;
				canvas!.height = parent.clientHeight;
			}
		};
		resize();

		const ro = new ResizeObserver(resize);
		if (canvas.parentElement) ro.observe(canvas.parentElement);

		const particles: Particle[] = Array.from({ length: count }, () => ({
			x: Math.random() * canvas!.width,
			y: Math.random() * canvas!.height,
			size: 1 + Math.random() * 2,
			opacity: 0.2 + Math.random() * 0.5,
			speed: (0.1 + Math.random() * 0.4) * speed,
			wobbleOffset: Math.random() * Math.PI * 2,
			wobbleSpeed: 0.5 + Math.random() * 1.5
		}));

		let animId: number;
		let lastTime = 0;

		function draw(now: number) {
			animId = requestAnimationFrame(draw);
			if (!isVisible) return;
			if (now - lastTime < 33) return;
			lastTime = now;
			if (!canvas || !ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (const p of particles) {
				p.y -= p.speed;
				p.x += Math.sin(now * 0.001 * p.wobbleSpeed + p.wobbleOffset) * 0.3;

				if (p.y < -10) {
					p.y = canvas.height + 10;
					p.x = Math.random() * canvas.width;
				}

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`);
				ctx.fill();
			}
		}

		animId = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(animId);
			ro.disconnect();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 z-0 pointer-events-none"
	aria-hidden="true"
></canvas>
