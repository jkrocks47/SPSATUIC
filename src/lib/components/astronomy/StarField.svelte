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

	// Use Page Visibility API instead of IntersectionObserver
	// (canvas is position:fixed — always "intersecting", so IO was useless)
	$effect(() => {
		if (!browser) return;

		const onVisibility = () => { isVisible = !document.hidden; };
		document.addEventListener('visibilitychange', onVisibility);

		return () => document.removeEventListener('visibilitychange', onVisibility);
	});

	$effect(() => {
		if (!browser || !canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const isMobile = window.innerWidth < 768;
		// Cap DPR: 1 on mobile (saves massive fill rate), 2 max on desktop
		const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);

		const resize = () => {
			const w = window.innerWidth;
			const h = window.innerHeight;
			canvas!.width = w * dpr;
			canvas!.height = h * dpr;
			canvas!.style.width = w + 'px';
			canvas!.style.height = h + 'px';
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener('resize', resize);

		// Reduced star count on mobile: 35 instead of 80
		const starCount = isMobile ? 35 : 200;
		const brightCount = isMobile ? 2 : 7;

		stars = Array.from({ length: starCount }, (_, i) => ({
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
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
				x: Math.random() * window.innerWidth * 0.8,
				y: Math.random() * window.innerHeight * 0.3,
				vx: 4 + Math.random() * 3,
				vy: 2 + Math.random() * 2,
				life: 0,
				maxLife: 40 + Math.random() * 30,
				trail: []
			};
			shootingStars.push(ss);
		}

		// Use logical (CSS) dimensions for drawing, not canvas pixel dimensions
		const logicalWidth = () => window.innerWidth;
		const logicalHeight = () => window.innerHeight;

		function draw(now: number) {
			animationId = requestAnimationFrame(draw);

			if (!isVisible) return;
			if (now - lastTime < 33) return;
			lastTime = now;

			if (!canvas || !ctx) return;

			const w = logicalWidth();
			const h = logicalHeight();

			ctx.clearRect(0, 0, w, h);

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
						star.y = h + 5;
						star.x = Math.random() * w;
					}
					if (star.x < -5) star.x = w + 5;
					if (star.x > w + 5) star.x = -5;
				}

				// Draw bright star glow halo — skip on mobile to reduce draw calls
				if (star.isBright && !isMobile) {
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

			// Draw shooting stars (desktop only)
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
