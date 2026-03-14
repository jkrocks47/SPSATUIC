<script lang="ts">
	import { browser } from '$app/environment';

	interface Star {
		x: number;
		y: number;
		size: number;
		opacity: number;
		speed: number;
		hue: number;
		isBright: boolean;
	}

	interface ShootingStar {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		trail: { x: number; y: number }[];
	}

	let canvas: HTMLCanvasElement | undefined = $state();
	let stars: Star[] = $state([]);
	let shootingStars: ShootingStar[] = $state([]);
	let animationId: number = 0;
	let reducedMotion = $state(false);
	let isVisible = $state(true);

	$effect(() => {
		if (!browser) return;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;

		const handler = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', handler);

		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || !canvas) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting;
			},
			{ threshold: 0 }
		);
		observer.observe(canvas);

		return () => observer.disconnect();
	});

	$effect(() => {
		if (!browser || !canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const resize = () => {
			canvas!.width = window.innerWidth;
			canvas!.height = window.innerHeight;
		};
		resize();
		window.addEventListener('resize', resize);

		const isMobile = window.innerWidth < 768;
		const starCount = isMobile ? 80 : 200;
		const brightCount = isMobile ? 3 : 7;

		stars = Array.from({ length: starCount }, (_, i) => ({
			x: Math.random() * canvas!.width,
			y: Math.random() * canvas!.height,
			size: i < brightCount ? 2.5 + Math.random() * 1.5 : 0.5 + Math.random() * 1.5,
			opacity: 0.3 + Math.random() * 0.7,
			speed: 0.05 + Math.random() * 0.15,
			hue: Math.random() > 0.7 ? 210 + Math.random() * 30 : 0,
			isBright: i < brightCount
		}));

		let lastTime = 0;
		let lastShootingTime = 0;
		const shootingInterval = 15000; // ~15 seconds

		function spawnShootingStar() {
			if (reducedMotion || isMobile) return;
			const ss: ShootingStar = {
				x: Math.random() * canvas!.width * 0.8,
				y: Math.random() * canvas!.height * 0.3,
				vx: 4 + Math.random() * 3,
				vy: 2 + Math.random() * 2,
				life: 0,
				maxLife: 40 + Math.random() * 30,
				trail: []
			};
			shootingStars.push(ss);
		}

		function draw(now: number) {
			animationId = requestAnimationFrame(draw);

			if (!isVisible) return;
			if (now - lastTime < 33) return;
			lastTime = now;

			if (!canvas || !ctx) return;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Spawn shooting stars periodically
			if (!reducedMotion && !isMobile && now - lastShootingTime > shootingInterval) {
				spawnShootingStar();
				lastShootingTime = now;
			}

			// Draw regular stars
			for (const star of stars) {
				if (!reducedMotion) {
					star.y -= star.speed;
					star.x += Math.sin(star.y * 0.002) * 0.1;

					if (star.y < -5) {
						star.y = canvas.height + 5;
						star.x = Math.random() * canvas.width;
					}
					if (star.x < -5) star.x = canvas.width + 5;
					if (star.x > canvas.width + 5) star.x = -5;
				}

				// Draw bright star glow halo
				if (star.isBright) {
					ctx.beginPath();
					ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
					const glowColor = star.hue > 0
						? `hsla(${star.hue}, 60%, 85%, ${star.opacity * 0.1})`
						: `rgba(255, 255, 255, ${star.opacity * 0.08})`;
					ctx.fillStyle = glowColor;
					ctx.fill();
				}

				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

				if (star.hue > 0) {
					ctx.fillStyle = `hsla(${star.hue}, 60%, 85%, ${star.opacity})`;
				} else {
					ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
				}

				ctx.fill();
			}

			// Draw shooting stars
			for (let i = shootingStars.length - 1; i >= 0; i--) {
				const ss = shootingStars[i];
				ss.trail.push({ x: ss.x, y: ss.y });
				if (ss.trail.length > 12) ss.trail.shift();

				ss.x += ss.vx;
				ss.y += ss.vy;
				ss.life++;

				const fadeIn = Math.min(ss.life / 5, 1);
				const fadeOut = Math.max(1 - (ss.life - ss.maxLife * 0.7) / (ss.maxLife * 0.3), 0);
				const alpha = Math.min(fadeIn, fadeOut);

				// Draw trail
				for (let j = 0; j < ss.trail.length; j++) {
					const t = j / ss.trail.length;
					ctx.beginPath();
					ctx.arc(ss.trail[j].x, ss.trail[j].y, 1.5 * t, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255, 255, 255, ${alpha * t * 0.6})`;
					ctx.fill();
				}

				// Draw head
				ctx.beginPath();
				ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
				ctx.fill();

				if (ss.life >= ss.maxLife) {
					shootingStars.splice(i, 1);
				}
			}
		}

		animationId = requestAnimationFrame(draw);

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationId);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed inset-0 z-0 pointer-events-none"
	aria-hidden="true"
></canvas>
