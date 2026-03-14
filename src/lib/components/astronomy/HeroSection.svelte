<script lang="ts">
	import { browser } from '$app/environment';
	import LunarPhaseViz from '$lib/components/astronomy/LunarPhaseViz.svelte';
	import AmbientParticles from '$lib/components/astronomy/AmbientParticles.svelte';

	interface Props {
		heroTitle?: string;
		heroSubtitle?: string;
		heroCta?: string;
	}

	let { heroTitle, heroSubtitle, heroCta }: Props = $props();

	let parallaxY = $state(0);
	let reducedMotion = $state(false);
	let mounted = $state(false);

	// Coordinate readout state
	let raH = $state(14);
	let raM = $state(23);
	let decD = $state(41);

	$effect(() => {
		if (!browser) return;
		mounted = true;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || reducedMotion) return;
		if (window.innerWidth < 768) return;

		const onScroll = () => {
			parallaxY = window.scrollY * 0.3;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Incrementing coordinate readout
	$effect(() => {
		if (!browser || reducedMotion) return;

		const interval = setInterval(() => {
			raM = (raM + 1) % 60;
			if (raM === 0) raH = (raH + 1) % 24;
			decD = decD + (Math.random() > 0.5 ? 1 : -1);
			if (decD > 90) decD = 89;
			if (decD < -90) decD = -89;
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<section class="relative h-dvh w-full overflow-hidden bg-[#080510]">
	<!-- Layer 1: Vivid nebula — warm oranges, deep purples, magentas, cosmic dust -->
	<div class="absolute inset-0 nebula-bg"></div>

	<!-- Layer 2: Luminous cloud body — bright ethereal teal-white, upper right -->
	<div class="absolute planetary-body pointer-events-none" aria-hidden="true">
		<div class="planet-core"></div>
		<div class="planet-glow-1"></div>
		<div class="planet-glow-2"></div>
		<div class="planet-glow-3"></div>
	</div>

	<!-- Layer 3: Star field sparkle points -->
	<div class="absolute inset-0 pointer-events-none star-scatter" aria-hidden="true"></div>

	<!-- Layer 3b: Film grain for photographic quality -->
	<div class="absolute inset-0 pointer-events-none hero-grain" aria-hidden="true"></div>

	<!-- Layer 4: Bottom atmospheric fade -->
	<div
		class="absolute inset-0 pointer-events-none"
		style="background: linear-gradient(to bottom, transparent 65%, rgba(12,8,22,0.3) 82%, rgba(12,8,22,0.6) 100%);"
	></div>

	<!-- Layer 5: Grid overlay — more visible -->
	<div class="absolute inset-0 grid-overlay pointer-events-none opacity-40"></div>

	<!-- Layer 5b: Additional fine coordinate grid lines -->
	<svg class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" aria-hidden="true">
		<!-- Horizontal guide lines -->
		{#each [20, 35, 50, 65, 80] as y}
			<line x1="0%" y1="{y}%" x2="100%" y2="{y}%" stroke="white" stroke-width="0.3" stroke-dasharray="3 12" />
		{/each}
		<!-- Vertical guide lines -->
		{#each [15, 30, 50, 70, 85] as x}
			<line x1="{x}%" y1="0%" x2="{x}%" y2="100%" stroke="white" stroke-width="0.3" stroke-dasharray="3 12" />
		{/each}
	</svg>

	<!-- Layer 6: Ambient particles -->
	<AmbientParticles count={60} color="rgba(255,240,220,0.3)" speed={0.08} />

	<!-- Layer 7: Constellation patterns -->
	<svg class="absolute inset-0 w-full h-full pointer-events-none opacity-80" aria-hidden="true">
		<!-- Orion (right mid area — visible against dark regions) -->
		<g class="constellation-group" style="animation-delay: 0s;">
			<circle cx="72%" cy="30%" r="2.5" fill="rgba(255,255,255,0.5)" />
			<circle cx="74%" cy="35%" r="1.8" fill="rgba(255,255,255,0.35)" />
			<circle cx="70%" cy="40%" r="2.5" fill="rgba(255,255,255,0.4)" />
			<circle cx="71%" cy="45%" r="1.8" fill="rgba(255,255,255,0.3)" />
			<circle cx="73%" cy="50%" r="3" fill="rgba(255,255,255,0.5)" />
			<circle cx="69%" cy="48%" r="1.8" fill="rgba(255,255,255,0.25)" />
			<circle cx="75%" cy="52%" r="1.8" fill="rgba(255,255,255,0.3)" />
			<line x1="72%" y1="30%" x2="74%" y2="35%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="74%" y1="35%" x2="70%" y2="40%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="70%" y1="40%" x2="71%" y2="45%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="71%" y1="45%" x2="69%" y2="48%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="71%" y1="45%" x2="73%" y2="50%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="71%" y1="45%" x2="75%" y2="52%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
		</g>
		<!-- Cassiopeia W (upper right) -->
		<g class="constellation-group" style="animation-delay: -3s;">
			<circle cx="80%" cy="10%" r="2" fill="rgba(255,255,255,0.4)" />
			<circle cx="83%" cy="16%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<circle cx="86%" cy="8%" r="2" fill="rgba(255,255,255,0.45)" />
			<circle cx="89%" cy="15%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<circle cx="92%" cy="9%" r="2" fill="rgba(255,255,255,0.4)" />
			<line x1="80%" y1="10%" x2="83%" y2="16%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="83%" y1="16%" x2="86%" y2="8%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="86%" y1="8%" x2="89%" y2="15%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
			<line x1="89%" y1="15%" x2="92%" y2="9%" stroke="rgba(255,255,255,0.15)" stroke-width="0.7" />
		</g>
		<!-- Leo (lower left area) -->
		<g class="constellation-group" style="animation-delay: -5s;">
			<circle cx="8%" cy="65%" r="2" fill="rgba(255,255,255,0.35)" />
			<circle cx="12%" cy="62%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="15%" cy="68%" r="2" fill="rgba(255,255,255,0.4)" />
			<circle cx="18%" cy="64%" r="1.8" fill="rgba(255,255,255,0.3)" />
			<circle cx="22%" cy="70%" r="2.5" fill="rgba(255,255,255,0.45)" />
			<circle cx="20%" cy="60%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<line x1="8%" y1="65%" x2="12%" y2="62%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="12%" y1="62%" x2="15%" y2="68%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="15%" y1="68%" x2="18%" y2="64%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="18%" y1="64%" x2="22%" y2="70%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="18%" y1="64%" x2="20%" y2="60%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
		</g>
		<!-- Lyra (upper left) -->
		<g class="constellation-group" style="animation-delay: -8s;">
			<circle cx="18%" cy="15%" r="3" fill="rgba(255,255,255,0.5)" />
			<circle cx="20%" cy="20%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<circle cx="16%" cy="22%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="22%" cy="24%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="19%" cy="26%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<line x1="18%" y1="15%" x2="20%" y2="20%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="18%" y1="15%" x2="16%" y2="22%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="20%" y1="20%" x2="22%" y2="24%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="16%" y1="22%" x2="19%" y2="26%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
			<line x1="22%" y1="24%" x2="19%" y2="26%" stroke="rgba(255,255,255,0.12)" stroke-width="0.5" />
		</g>
		<!-- Corona Borealis (mid upper area) -->
		<g class="constellation-group" style="animation-delay: -2s;">
			<circle cx="40%" cy="8%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<circle cx="44%" cy="6%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="48%" cy="7%" r="2" fill="rgba(255,255,255,0.35)" />
			<circle cx="51%" cy="10%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="52%" cy="14%" r="1.5" fill="rgba(255,255,255,0.3)" />
			<line x1="40%" y1="8%" x2="44%" y2="6%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="44%" y1="6%" x2="48%" y2="7%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="48%" y1="7%" x2="51%" y2="10%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="51%" y1="10%" x2="52%" y2="14%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
		</g>
		<!-- Scattered individual bright stars -->
		<circle cx="5%" cy="12%" r="1.5" fill="rgba(255,255,255,0.35)" />
		<circle cx="35%" cy="75%" r="2" fill="rgba(255,255,255,0.25)" />
		<circle cx="60%" cy="85%" r="1.5" fill="rgba(255,255,255,0.3)" />
		<circle cx="88%" cy="55%" r="1.8" fill="rgba(255,255,255,0.2)" />
		<circle cx="45%" cy="18%" r="1" fill="rgba(255,255,255,0.35)" />
		<circle cx="28%" cy="48%" r="1.2" fill="rgba(255,255,255,0.2)" />
		<circle cx="55%" cy="58%" r="1" fill="rgba(255,255,255,0.25)" />
		<circle cx="95%" cy="35%" r="1.5" fill="rgba(255,255,255,0.2)" />
		<circle cx="3%" cy="45%" r="1" fill="rgba(255,255,255,0.3)" />
		<circle cx="65%" cy="15%" r="1.2" fill="rgba(255,255,255,0.25)" />
	</svg>

	<!-- Layer 8: Technical crosshairs — MORE scattered for busy feel -->
	{#each [
		{ top: '18%', left: '8%', delay: 0 },
		{ top: '30%', right: '12%', delay: 200 },
		{ bottom: '35%', left: '15%', delay: 400 },
		{ bottom: '25%', right: '20%', delay: 600 },
		{ top: '55%', left: '50%', delay: 800 },
		{ top: '12%', left: '55%', delay: 1000 },
		{ top: '65%', right: '40%', delay: 1200 },
		{ top: '8%', left: '30%', delay: 300 },
		{ top: '42%', right: '8%', delay: 500 },
		{ bottom: '15%', left: '40%', delay: 700 },
		{ top: '75%', left: '12%', delay: 900 },
		{ top: '22%', right: '35%', delay: 1100 },
		{ bottom: '40%', right: '45%', delay: 1300 },
		{ top: '50%', left: '5%', delay: 150 },
		{ bottom: '10%', right: '55%', delay: 450 }
	] as cross}
		<span
			class="absolute font-mono text-xs text-white/30 pointer-events-none select-none crosshair-anim"
			class:mounted
			style="
				top: {cross.top ?? 'auto'};
				bottom: {cross.bottom ?? 'auto'};
				left: {cross.left ?? 'auto'};
				right: {cross.right ?? 'auto'};
				transition-delay: {cross.delay}ms;
			"
		>+</span>
	{/each}

	<!-- Layer 8b: Scattered HUD data readout boxes -->
	<!-- Top-left: coordinate tracking box -->
	<div class="absolute top-24 left-6 z-30 hidden lg:block pointer-events-none">
		<div class="hud-data-box p-2" style="border: 1px solid rgba(255,255,255,0.08);">
			<div class="font-mono text-[9px] tracking-[0.2em] text-white/20 mb-1">TRACKING DATA</div>
			<div class="font-mono text-[10px] tracking-[0.15em] text-white/30 space-y-0.5">
				<div>RA {String(raH).padStart(2, '0')}h {String(raM).padStart(2, '0')}m</div>
				<div>DEC +{decD}&deg; 12' 04"</div>
				<div class="text-astro-cyan/35">&#9679; TRACKING ACTIVE</div>
			</div>
			<!-- Corner brackets -->
			<span class="absolute -top-px -left-px w-2 h-2 border-l border-t border-white/15"></span>
			<span class="absolute -top-px -right-px w-2 h-2 border-r border-t border-white/15"></span>
			<span class="absolute -bottom-px -left-px w-2 h-2 border-l border-b border-white/15"></span>
			<span class="absolute -bottom-px -right-px w-2 h-2 border-r border-b border-white/15"></span>
		</div>
	</div>

	<!-- Mid-left: exposure data -->
	<div class="absolute top-[38%] left-[3%] z-30 hidden lg:block pointer-events-none">
		<div class="hud-data-box p-1.5" style="border: 1px solid rgba(255,255,255,0.06);">
			<div class="font-mono text-[8px] tracking-[0.25em] text-white/15 space-y-0.5">
				<div>FRAME 0024</div>
				<div>ISO 3200 / f2.8</div>
				<div>EXP: 30s</div>
				<div class="text-astro-orange/25">&#9632; RECORDING</div>
			</div>
		</div>
	</div>

	<!-- Top-center-left: small targeting reticle SVG -->
	<div class="absolute top-[15%] left-[25%] hidden lg:block pointer-events-none opacity-20" aria-hidden="true">
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
			<circle cx="20" cy="20" r="12" stroke="rgba(255,255,255,0.4)" stroke-width="0.5" />
			<circle cx="20" cy="20" r="6" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
			<line x1="20" y1="4" x2="20" y2="14" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
			<line x1="20" y1="26" x2="20" y2="36" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
			<line x1="4" y1="20" x2="14" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
			<line x1="26" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" />
			<circle cx="20" cy="20" r="1.5" fill="rgba(34,211,238,0.4)" />
		</svg>
	</div>

	<!-- Mid-right: another targeting reticle -->
	<div class="absolute top-[55%] right-[18%] hidden lg:block pointer-events-none opacity-15" aria-hidden="true">
		<svg width="50" height="50" viewBox="0 0 50 50" fill="none">
			<rect x="5" y="5" width="40" height="40" stroke="rgba(255,255,255,0.3)" stroke-width="0.5" fill="none" />
			<line x1="25" y1="0" x2="25" y2="50" stroke="rgba(255,255,255,0.15)" stroke-width="0.3" />
			<line x1="0" y1="25" x2="50" y2="25" stroke="rgba(255,255,255,0.15)" stroke-width="0.3" />
			<circle cx="25" cy="25" r="8" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" />
			<circle cx="25" cy="25" r="2" fill="rgba(34,211,238,0.3)" />
		</svg>
	</div>

	<!-- Bottom-left: timestamp + session data -->
	<div class="absolute bottom-[12%] left-[5%] z-30 hidden lg:block pointer-events-none">
		<div class="font-mono text-[8px] tracking-[0.2em] text-white/12 space-y-0.5">
			<div>SESSION: UIC-OBS-2024-{String(raH).padStart(2,'0')}{String(raM).padStart(2,'0')}</div>
			<div>UTC 04:23:17.442</div>
			<div>SEEING: 2.1"</div>
			<div>TEMP: -4.2&deg;C</div>
		</div>
	</div>

	<!-- Upper-right small data annotation -->
	<div class="absolute top-[20%] right-[30%] z-30 hidden xl:block pointer-events-none">
		<div class="font-mono text-[7px] tracking-[0.3em] text-white/10">
			<div>OBJ: NGC 2024</div>
			<div>MAG: +2.3</div>
		</div>
	</div>

	<!-- Bottom-center: measurement scale bar -->
	<div class="absolute bottom-[6%] left-1/2 -translate-x-1/2 hidden lg:block pointer-events-none" aria-hidden="true">
		<div class="flex items-center gap-2">
			<div class="w-20 h-px bg-white/10"></div>
			<span class="font-mono text-[7px] text-white/12 tracking-wider">5 ARCMIN</span>
			<div class="w-20 h-px bg-white/10"></div>
		</div>
	</div>

	<!-- Left side: vertical measurement ticks -->
	<div class="absolute top-[30%] left-[1%] hidden xl:block pointer-events-none" aria-hidden="true">
		<svg width="12" height="120" viewBox="0 0 12 120" fill="none">
			{#each Array(13) as _, i}
				<line x1={i % 3 === 0 ? 0 : 4} y1={i * 10} x2="12" y2={i * 10} stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
			{/each}
			<line x1="6" y1="0" x2="6" y2="120" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
		</svg>
	</div>

	<!-- Right side: horizontal measurement scale -->
	<div class="absolute top-[85%] right-[25%] hidden xl:block pointer-events-none" aria-hidden="true">
		<svg width="120" height="12" viewBox="0 0 120 12" fill="none">
			{#each Array(13) as _, i}
				<line x1={i * 10} y1={i % 3 === 0 ? 0 : 4} x2={i * 10} y2="12" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
			{/each}
			<line x1="0" y1="6" x2="120" y2="6" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
		</svg>
	</div>

	<!-- Layer 10: Planetary position dial (bottom-right) -->
	<div class="absolute bottom-[8%] right-[4%] w-56 h-56 lg:w-64 lg:h-64 opacity-60 pointer-events-none hidden lg:block">
		<svg viewBox="0 0 220 220" fill="none" class="w-full h-full">
			<defs>
				<path id="textCircle" d="M 110 110 m -95 0 a 95 95 0 1 1 190 0 a 95 95 0 1 1 -190 0" />
			</defs>

			<circle cx="110" cy="110" r="105" stroke="rgba(255,255,255,0.25)" stroke-width="1" class="viewfinder-ring-outer" />
			<circle cx="110" cy="110" r="85" stroke="rgba(255,255,255,0.18)" stroke-width="0.8" />
			<circle cx="110" cy="110" r="65" stroke="rgba(255,255,255,0.12)" stroke-width="0.6" />
			<circle cx="110" cy="110" r="45" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
			<circle cx="110" cy="110" r="25" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

			<text font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.3)" letter-spacing="3">
				<textPath href="#textCircle" startOffset="5%">PLANETARY CHART POSITIONS</textPath>
			</text>
			<text font-family="'JetBrains Mono', monospace" font-size="5" fill="rgba(255,255,255,0.2)" letter-spacing="2">
				<textPath href="#textCircle" startOffset="60%">FOV 2.4&deg; &bull; EQ MOUNT</textPath>
			</text>

			<line x1="110" y1="5" x2="110" y2="35" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />
			<line x1="110" y1="185" x2="110" y2="215" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />
			<line x1="5" y1="110" x2="35" y2="110" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />
			<line x1="185" y1="110" x2="215" y2="110" stroke="rgba(255,255,255,0.3)" stroke-width="0.8" />

			<text x="110" y="18" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.2)">0&deg;</text>
			<text x="202" y="113" text-anchor="start" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.2)">90&deg;</text>
			<text x="110" y="212" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.2)">180&deg;</text>
			<text x="18" y="113" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.2)">270&deg;</text>

			{#each Array(72) as _, i}
				{@const angle = (i * 5 * Math.PI) / 180}
				{@const inner = i % 6 === 0 ? 98 : 101}
				{@const x1 = 110 + inner * Math.cos(angle)}
				{@const y1 = 110 + inner * Math.sin(angle)}
				{@const x2 = 110 + 105 * Math.cos(angle)}
				{@const y2 = 110 + 105 * Math.sin(angle)}
				<line
					{x1} {y1} {x2} {y2}
					stroke="rgba(255,255,255,0.14)"
					stroke-width={i % 18 === 0 ? '1.2' : i % 6 === 0 ? '0.8' : '0.4'}
				/>
			{/each}

			{#each [45, 135, 225, 315] as deg}
				{@const rad = (deg * Math.PI) / 180}
				{@const ax1 = 110 + 70 * Math.cos(rad - 0.2)}
				{@const ay1 = 110 + 70 * Math.sin(rad - 0.2)}
				{@const ax2 = 110 + 70 * Math.cos(rad + 0.2)}
				{@const ay2 = 110 + 70 * Math.sin(rad + 0.2)}
				<path d="M {ax1} {ay1} A 70 70 0 0 1 {ax2} {ay2}" stroke="rgba(34,211,238,0.2)" stroke-width="1.2" fill="none" />
			{/each}

			<circle cx="110" cy="110" r="75" stroke="rgba(34,211,238,0.08)" stroke-width="0.4" stroke-dasharray="4 8" class="viewfinder-ring-inner" />
			<circle cx="110" cy="110" r="4" stroke="rgba(34,211,238,0.4)" stroke-width="1" fill="none" class="center-pulse" />
			<circle cx="110" cy="110" r="2" fill="rgba(34,211,238,0.3)" class="center-pulse" />
			<line x1="110" y1="110" x2="110" y2="8" stroke="rgba(34,211,238,0.15)" stroke-width="0.6" class="radar-line" />
		</svg>
	</div>

	<!-- Layer 11: Main content — CENTERED like reference design -->
	<div
		class="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-10 lg:px-16 text-center max-w-6xl mx-auto"
		style="transform: translateY({parallaxY}px)"
	>
		<!-- Colossal distressed headline -->
		<h1 class="font-display-hero uppercase">
			{#if heroTitle}
				<span
					class="hero-observe relative block"
					class:mounted
					style="font-size: clamp(3.5rem, 10vw, 8rem); line-height: 0.95;"
				>
					{#each heroTitle.split('') as char, i}
						<span class="hero-letter hero-text-inner" class:mounted style="transition-delay: {300 + i * 40}ms">{char === ' ' ? '\u00A0' : char}</span>
					{/each}
				</span>
			{:else}
				<span
					class="hero-observe relative block"
					class:mounted
					style="font-size: clamp(4.5rem, 13vw, 11rem); line-height: 0.9;"
				>
					{#each 'OBSERVE'.split('') as char, i}
						<span class="hero-letter hero-text-inner" class:mounted style="transition-delay: {300 + i * 40}ms">{char}</span>
					{/each}
				</span>
				<span
					class="hero-cosmos block"
					class:mounted
					style="font-size: clamp(3.5rem, 9.5vw, 8rem); line-height: 0.95;"
				>
					{#each 'THE COSMOS'.split('') as char, i}
						<span class="hero-letter hero-text-inner" class:mounted style="transition-delay: {500 + i * 35}ms">{char === ' ' ? '\u00A0' : char}</span>
					{/each}
				</span>
			{/if}
		</h1>

		<p class="mt-5 font-body text-sm md:text-base text-astro-cream/60 max-w-lg hero-subtitle" class:mounted>
			{heroSubtitle ?? 'University of Illinois Chicago — Exploring the universe from the urban canopy. EST. 2010.'}
		</p>

		<!-- CTA: command-line terminal feel -->
		<div class="relative mt-6 cta-wrapper" class:mounted>
			<a href="/astronomy/events" class="cta-terminal">
				[ {heroCta ?? 'INITIATE OBSERVATION'} ]
			</a>
			<div class="cta-scan-line"></div>
		</div>
	</div>

	<!-- Layer 11b: Foreground nebula cloud — overlaps text for depth -->
	<div class="absolute inset-0 z-20 pointer-events-none nebula-cloud-overlay" aria-hidden="true">
		<div class="nebula-cloud-core"></div>
		<div class="nebula-cloud-haze"></div>
		<div class="nebula-cloud-wisp"></div>
	</div>

	<!-- Layer 12: Lunar phase viz (right edge) -->
	<div class="absolute right-[-2rem] top-1/2 -translate-y-1/2 opacity-35 pointer-events-none hidden md:block">
		<LunarPhaseViz />
	</div>

	<!-- Layer 13: Scattered technical data readouts -->
	<div class="absolute bottom-[18%] right-[8%] font-mono text-[9px] tracking-[0.15em] text-white/15 hidden lg:block pointer-events-none" aria-hidden="true">
		<div>AZ: 182.4&deg;</div>
		<div>ALT: +67.2&deg;</div>
		<div class="text-astro-cyan/20">LOCK</div>
	</div>
	<div class="absolute top-[45%] left-[3%] font-mono text-[8px] tracking-[0.2em] text-white/10 hidden lg:block pointer-events-none" aria-hidden="true">
		<div>FRAME 0024</div>
		<div>ISO 3200</div>
	</div>
</section>

<style>
	/* HUD data readout boxes */
	.hud-data-box {
		position: relative;
		background: rgba(0,0,0,0.25);
		backdrop-filter: blur(4px);
	}

	/* ================================================================
	   VIVID NEBULA BACKGROUND
	   Warm oranges, deep purples, magentas, cosmic dust.
	   This replaces the NebulaBackground component with richer,
	   more vibrant CSS gradients matching the wireframe.
	   ================================================================ */
	.nebula-bg {
		background:
			/* Bright vivid blue/teal nebula core — center-right, wider coverage */
			radial-gradient(ellipse 95% 85% at 55% 40%,
				rgba(30,160,240,0.85) 0%,
				rgba(40,120,220,0.65) 12%,
				rgba(25,90,190,0.45) 25%,
				rgba(20,60,150,0.3) 40%,
				transparent 75%),
			/* INTENSE orange/amber nebula — upper left, dominant warm glow */
			radial-gradient(ellipse 75% 70% at 15% 20%,
				rgba(255,170,60,0.95) 0%,
				rgba(255,130,40,0.85) 12%,
				rgba(240,90,50,0.7) 25%,
				rgba(210,60,65,0.5) 40%,
				transparent 70%),
			/* Secondary warm orange — extends into center */
			radial-gradient(ellipse 50% 45% at 35% 25%,
				rgba(255,150,50,0.6) 0%,
				rgba(240,110,40,0.4) 25%,
				rgba(200,70,50,0.2) 45%,
				transparent 65%),
			/* Warm amber wash — lower left, extended */
			radial-gradient(ellipse 60% 55% at 18% 65%,
				rgba(240,140,50,0.75) 0%,
				rgba(225,110,40,0.55) 20%,
				rgba(190,70,45,0.35) 40%,
				transparent 70%),
			/* Hot magenta/rose — center-left, vivid wisps */
			radial-gradient(ellipse 55% 50% at 30% 35%,
				rgba(240,70,150,0.55) 0%,
				rgba(210,50,130,0.4) 20%,
				rgba(170,35,105,0.25) 40%,
				transparent 60%),
			/* Deep rich purple mass — behind text area, enlarged */
			radial-gradient(ellipse 100% 90% at 42% 40%,
				rgba(120,40,180,0.7) 0%,
				rgba(90,25,150,0.5) 25%,
				rgba(60,18,110,0.45) 45%,
				transparent 80%),
			/* Bright teal glow — right side, near planetary body */
			radial-gradient(ellipse 45% 55% at 72% 40%,
				rgba(40,220,255,0.45) 0%,
				rgba(25,150,200,0.3) 30%,
				transparent 60%),
			/* Golden star-dense area — upper center */
			radial-gradient(ellipse 50% 40% at 38% 15%,
				rgba(255,235,190,0.6) 0%,
				rgba(255,210,150,0.4) 25%,
				transparent 55%),
			/* Amber edge glow — top right, wrapping planetary body */
			radial-gradient(ellipse 50% 45% at 78% 15%,
				rgba(245,160,70,0.6) 0%,
				rgba(230,120,50,0.4) 25%,
				transparent 55%),
			/* Orange-red nebula tail — bottom center */
			radial-gradient(ellipse 60% 30% at 45% 85%,
				rgba(200,70,40,0.35) 0%,
				rgba(160,40,50,0.2) 30%,
				transparent 60%),
			/* NEW: Warm rose/salmon dust — fills lower-center void */
			radial-gradient(ellipse 70% 50% at 55% 60%,
				rgba(180,80,60,0.3) 0%,
				rgba(140,50,70,0.2) 30%,
				transparent 65%),
			/* NEW: Violet interstellar medium — mid-field density */
			radial-gradient(ellipse 80% 70% at 35% 55%,
				rgba(80,40,120,0.35) 0%,
				rgba(50,25,90,0.25) 35%,
				transparent 70%),
			/* NEW: Warm amber haze — bottom third */
			radial-gradient(ellipse 100% 40% at 50% 90%,
				rgba(200,120,50,0.25) 0%,
				rgba(160,80,40,0.15) 40%,
				transparent 70%),
			/* Deep cosmic base — slightly lighter for less dead-black */
			linear-gradient(to bottom,
				#10081e 0%,
				#140c30 18%,
				#110a28 35%,
				#0d0920 55%,
				#090616 100%);
	}

	/* Star scatter — tiny bright points */
	.star-scatter {
		background-image:
			radial-gradient(1.5px 1.5px at 10% 15%, rgba(255,255,255,0.9), transparent),
			radial-gradient(1px 1px at 25% 8%, rgba(255,255,255,0.7), transparent),
			radial-gradient(2px 2px at 45% 12%, rgba(255,255,255,1), transparent),
			radial-gradient(1px 1px at 60% 22%, rgba(255,255,255,0.6), transparent),
			radial-gradient(1.5px 1.5px at 82% 18%, rgba(255,255,255,0.8), transparent),
			radial-gradient(2px 2px at 90% 25%, rgba(255,255,255,0.7), transparent),
			radial-gradient(1px 1px at 15% 55%, rgba(255,255,255,0.5), transparent),
			radial-gradient(1.5px 1.5px at 35% 62%, rgba(255,255,255,0.7), transparent),
			radial-gradient(1px 1px at 55% 70%, rgba(255,255,255,0.6), transparent),
			radial-gradient(2px 2px at 75% 58%, rgba(255,255,255,0.8), transparent),
			radial-gradient(1px 1px at 88% 65%, rgba(255,255,255,0.5), transparent),
			radial-gradient(1px 1px at 5% 80%, rgba(255,255,255,0.6), transparent),
			radial-gradient(1.5px 1.5px at 30% 85%, rgba(255,255,255,0.5), transparent),
			radial-gradient(1px 1px at 65% 78%, rgba(255,255,255,0.7), transparent),
			radial-gradient(1.5px 1.5px at 92% 82%, rgba(255,255,255,0.6), transparent),
			radial-gradient(2.5px 2.5px at 50% 5%, rgba(255,225,180,1), transparent),
			radial-gradient(2.5px 2.5px at 20% 35%, rgba(200,225,255,0.9), transparent),
			radial-gradient(2.5px 2.5px at 85% 42%, rgba(255,210,150,0.8), transparent),
			radial-gradient(1px 1px at 3% 30%, rgba(255,255,255,0.6), transparent),
			radial-gradient(1px 1px at 40% 45%, rgba(255,255,255,0.5), transparent),
			radial-gradient(1.5px 1.5px at 70% 35%, rgba(255,255,255,0.7), transparent),
			radial-gradient(1px 1px at 95% 50%, rgba(255,255,255,0.6), transparent),
			radial-gradient(1px 1px at 50% 90%, rgba(255,255,255,0.4), transparent),
			radial-gradient(2px 2px at 12% 42%, rgba(255,200,150,0.7), transparent),
			/* Additional star density */
			radial-gradient(0.8px 0.8px at 8% 22%, rgba(255,255,255,0.4), transparent),
			radial-gradient(1px 1px at 18% 48%, rgba(255,220,170,0.5), transparent),
			radial-gradient(0.6px 0.6px at 32% 18%, rgba(200,220,255,0.4), transparent),
			radial-gradient(1.2px 1.2px at 42% 72%, rgba(255,255,255,0.5), transparent),
			radial-gradient(0.8px 0.8px at 58% 38%, rgba(255,240,200,0.3), transparent),
			radial-gradient(1px 1px at 68% 52%, rgba(200,210,255,0.5), transparent),
			radial-gradient(0.6px 0.6px at 78% 72%, rgba(255,255,255,0.3), transparent),
			radial-gradient(1.5px 1.5px at 22% 82%, rgba(255,210,160,0.5), transparent),
			radial-gradient(0.8px 0.8px at 48% 28%, rgba(255,255,255,0.35), transparent),
			radial-gradient(1px 1px at 62% 8%, rgba(200,225,255,0.5), transparent),
			radial-gradient(0.6px 0.6px at 85% 32%, rgba(255,255,255,0.3), transparent),
			radial-gradient(2.5px 2.5px at 38% 42%, rgba(255,225,180,0.7), transparent),
			radial-gradient(0.8px 0.8px at 92% 68%, rgba(255,255,255,0.35), transparent),
			radial-gradient(1px 1px at 7% 58%, rgba(200,215,255,0.4), transparent),
			radial-gradient(3px 3px at 72% 15%, rgba(255,240,200,0.8), transparent);
	}

	/* ================================================================
	   LUMINOUS PLANETARY / CLOUD BODY
	   Bright, visible, ethereal teal-white — positioned upper-right
	   like the wireframe's glowing nebula cloud.
	   ================================================================ */
	.planetary-body {
		width: clamp(400px, 55vw, 800px);
		height: clamp(400px, 55vw, 800px);
		top: -5%;
		right: 0%;
		left: auto;
	}

	.planet-core {
		position: absolute;
		inset: 15%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 45% 40%,
			rgba(255,252,245,0.95) 0%,
			rgba(240,245,250,0.8) 10%,
			rgba(180,230,245,0.65) 25%,
			rgba(120,200,230,0.5) 40%,
			rgba(60,150,190,0.3) 60%,
			transparent 80%
		);
		filter: blur(3px);
	}

	.planet-glow-1 {
		position: absolute;
		inset: 5%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 45% 40%,
			rgba(200,240,255,0.55) 0%,
			rgba(120,210,240,0.35) 30%,
			transparent 60%
		);
		filter: blur(25px);
		animation: atmo-drift 25s ease-in-out infinite;
	}

	.planet-glow-2 {
		position: absolute;
		inset: -2%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 50% 45%,
			rgba(220,240,255,0.3) 0%,
			rgba(150,220,245,0.18) 35%,
			transparent 65%
		);
		filter: blur(45px);
		animation: atmo-drift 30s ease-in-out infinite reverse;
	}

	.planet-glow-3 {
		position: absolute;
		inset: -10%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(220,240,255,0.18) 0%,
			rgba(150,210,240,0.1) 40%,
			transparent 70%
		);
		filter: blur(60px);
		animation: atmo-drift 35s ease-in-out infinite;
		animation-delay: -10s;
	}

	@keyframes atmo-drift {
		0%, 100% { transform: translate(0, 0) scale(1); }
		33% { transform: translate(2%, -1%) scale(1.02); }
		66% { transform: translate(-1%, 2%) scale(0.98); }
	}

	/* ================================================================
	   TYPOGRAPHY — Distressed, weathered, warm bone-white
	   ================================================================ */
	.hero-observe {
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out;
		letter-spacing: -0.03em;
	}

	.hero-observe.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.3s;
	}

	.hero-text-inner {
		background: linear-gradient(
			to bottom,
			#faf3e8 0%,
			#f0e2cc 40%,
			#e0c8a8 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		text-shadow: none;
		position: relative;
		display: inline-block;
		filter: drop-shadow(0 2px 12px rgba(0,0,0,0.6))
			drop-shadow(0 0 40px rgba(0,0,0,0.4))
			drop-shadow(0 0 80px rgba(232,140,60,0.25));
	}

	/* Per-letter GPU-accelerated animation */
	.hero-letter {
		display: inline-block;
		transform: translateX(0.3em);
		opacity: 0;
		transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out;
		will-change: transform, opacity;
	}

	.hero-letter.mounted {
		transform: translateX(0);
		opacity: 1;
	}

	/* Subtle glow behind OBSERVE */
	.hero-observe::after {
		content: '';
		position: absolute;
		top: 10%;
		left: 5%;
		width: 90%;
		height: 80%;
		background: radial-gradient(
			ellipse at center,
			rgba(232,130,50,0.18) 0%,
			rgba(210,70,100,0.10) 40%,
			transparent 70%
		);
		filter: blur(50px);
		pointer-events: none;
		z-index: -1;
	}

	.hero-cosmos {
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out;
		letter-spacing: -0.03em;
	}

	.hero-cosmos.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.5s;
	}

	.hero-subtitle {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.hero-subtitle.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.8s;
	}

	.cta-wrapper {
		opacity: 0;
		transform: translateY(15px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.cta-wrapper.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 1s;
	}

	/* CTA: typewriter / command-line terminal */
	.cta-terminal {
		display: inline-flex;
		align-items: center;
		padding: 0.65rem 1.8rem;
		border: 1px solid rgba(245,240,232,0.35);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #f5f0e8;
		background: rgba(245,240,232,0.06);
		transition: all 0.3s ease;
		cursor: pointer;
		text-decoration: none;
	}

	.cta-terminal:hover {
		background: rgba(245,240,232,0.14);
		border-color: rgba(245,240,232,0.55);
		box-shadow: 0 0 30px rgba(232,120,50,0.15);
	}

	/* CTA scanning line */
	.cta-scan-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.cta-scan-line::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 30%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(245,240,232,0.08), transparent);
		animation: cta-sweep 8s ease-in-out infinite;
	}

	@keyframes cta-sweep {
		0%, 80%, 100% { transform: translateX(-100%); }
		40% { transform: translateX(400%); }
	}

	/* Crosshair fade-in */
	.crosshair-anim {
		opacity: 0;
		transition: opacity 0.6s ease-out;
	}

	.crosshair-anim.mounted {
		opacity: 1;
		animation: crosshair-glow 5s ease-in-out infinite;
	}

	@keyframes crosshair-glow {
		0%, 100% { opacity: 0.15; }
		50% { opacity: 0.35; }
	}

	/* Constellation twinkle */
	:global(.constellation-group) {
		animation: constellation-twinkle 8s ease-in-out infinite;
	}

	@keyframes constellation-twinkle {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	/* Viewfinder animations */
	.viewfinder-ring-outer {
		transform-origin: 110px 110px;
		animation: vf-rotate 45s linear infinite;
	}

	:global(.viewfinder-ring-inner) {
		transform-origin: 110px 110px;
		animation: vf-rotate 60s linear infinite reverse;
	}

	.center-pulse {
		animation: center-glow 3s ease-in-out infinite;
	}

	.radar-line {
		transform-origin: 110px 110px;
		animation: radar-sweep-anim 20s linear infinite;
		opacity: 0.4;
	}

	@keyframes vf-rotate {
		to { transform: rotate(360deg); }
	}

	@keyframes center-glow {
		0%, 100% { opacity: 0.2; }
		50% { opacity: 0.6; }
	}

	@keyframes radar-sweep-anim {
		to { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.crosshair-anim {
			opacity: 0.15;
		}

		.crosshair-anim.mounted {
			animation: none;
		}

		.hero-observe,
		.hero-cosmos,
		.hero-subtitle,
		.cta-wrapper {
			opacity: 1;
			transform: none;
			transition: none;
			letter-spacing: -0.03em;
		}

		.hero-letter {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.cta-scan-line::after {
			animation: none;
		}

		.viewfinder-ring-outer,
		.radar-line {
			animation: none;
		}

		.center-pulse {
			animation: none;
			opacity: 0.4;
		}

		.planet-glow-1,
		.planet-glow-2,
		.planet-glow-3 {
			animation: none;
		}

		.nebula-cloud-core,
		.nebula-cloud-haze,
		.nebula-cloud-wisp {
			animation: none;
		}
	}

	/* ================================================================
	   FOREGROUND NEBULA CLOUD OVERLAY
	   Creates a luminous cloud sitting IN FRONT of the hero text,
	   producing the depth illusion from the mockup.
	   ================================================================ */
	.nebula-cloud-overlay {
		mix-blend-mode: normal;
	}

	.nebula-cloud-core {
		position: absolute;
		width: 75%;
		height: 55%;
		top: 20%;
		left: 12%;
		background:
			radial-gradient(
				ellipse 60% 45% at 50% 48%,
				rgba(200,180,170,0.4) 0%,
				rgba(180,160,175,0.3) 15%,
				rgba(150,140,170,0.2) 35%,
				rgba(120,115,150,0.1) 55%,
				transparent 75%
			);
		filter: blur(30px);
		animation: cloud-drift 40s ease-in-out infinite;
	}

	.nebula-cloud-haze {
		position: absolute;
		width: 55%;
		height: 42%;
		top: 26%;
		left: 22%;
		background:
			radial-gradient(
				ellipse 50% 40% at 48% 45%,
				rgba(220,205,195,0.35) 0%,
				rgba(190,175,180,0.25) 22%,
				rgba(160,150,170,0.12) 45%,
				transparent 70%
			);
		filter: blur(22px);
		animation: cloud-drift 35s ease-in-out infinite reverse;
	}

	.nebula-cloud-wisp {
		position: absolute;
		width: 40%;
		height: 32%;
		top: 30%;
		left: 30%;
		background:
			radial-gradient(
				ellipse 55% 35% at 45% 52%,
				rgba(240,230,220,0.3) 0%,
				rgba(200,185,180,0.18) 30%,
				transparent 60%
			);
		filter: blur(16px);
		animation: cloud-drift 28s ease-in-out infinite;
		animation-delay: -8s;
	}

	/* Bright highlight spot — concentrated bright area in center of cloud */
	.nebula-cloud-overlay::after {
		content: '';
		position: absolute;
		width: 35%;
		height: 25%;
		top: 30%;
		left: 32%;
		background: radial-gradient(
			ellipse 45% 35% at 50% 50%,
			rgba(255,245,235,0.25) 0%,
			rgba(230,215,200,0.15) 35%,
			transparent 65%
		);
		filter: blur(25px);
	}

	@keyframes cloud-drift {
		0%, 100% { transform: translate(0, 0) scale(1); }
		33% { transform: translate(2%, -1%) scale(1.03); }
		66% { transform: translate(-1.5%, 1.5%) scale(0.97); }
	}

	/* Hero film grain overlay */
	.hero-grain {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
		background-size: 256px 256px;
		opacity: 0.035;
		mix-blend-mode: overlay;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.planetary-body {
			width: 320px;
			height: 320px;
			top: -5%;
			right: -15%;
		}

		.nebula-cloud-core {
			filter: blur(20px);
			opacity: 0.7;
		}

		.nebula-cloud-haze,
		.nebula-cloud-wisp {
			display: none;
		}
	}
</style>
