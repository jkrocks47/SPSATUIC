<script lang="ts">
	interface Props {
		heroTitle?: string;
		heroSubtitle?: string;
		heroCta?: string;
	}

	let { heroTitle, heroSubtitle, heroCta }: Props = $props();

	// Decorative circles data
	const circles = [
		{ cx: '85%', cy: '20%', r: 120, opacity: 0.06 },
		{ cx: '10%', cy: '70%', r: 80, opacity: 0.04 },
		{ cx: '70%', cy: '80%', r: 60, opacity: 0.05 }
	];
</script>

<section class="relative min-h-[90vh] flex items-center overflow-hidden">
	<!-- Decorative geometric elements -->
	<div class="absolute inset-0 pointer-events-none" aria-hidden="true">
		<svg class="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
			{#each circles as circle}
				<circle
					cx={circle.cx}
					cy={circle.cy}
					r={circle.r}
					fill="none"
					stroke="#0e79b2"
					stroke-width="1"
					opacity={circle.opacity}
				/>
			{/each}
			<!-- Decorative lines -->
			<line x1="0" y1="400" x2="200" y2="400" stroke="#0e79b2" stroke-width="0.5" opacity="0.08" />
			<line x1="1000" y1="200" x2="1200" y2="200" stroke="#0e79b2" stroke-width="0.5" opacity="0.08" />
			<line x1="600" y1="0" x2="600" y2="100" stroke="#0e79b2" stroke-width="0.5" opacity="0.06" />
		</svg>
	</div>

	<!-- Subtle dot -->
	<div class="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-physics-blue/20 animate-float" aria-hidden="true"></div>
	<div class="absolute bottom-1/3 left-1/6 w-3 h-3 rounded-full border border-physics-blue/15 animate-drift" aria-hidden="true"></div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
		<div class="max-w-3xl">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 mb-6 uppercase">
				Society of Physics Students at UIC
			</p>
			<h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-physics-dark leading-[1.1]">
				{#if heroTitle}
					{heroTitle}
				{:else}
					EXPLORE.<br />
					DISCOVER.<br />
					UNDERSTAND.
				{/if}
			</h1>
			<p class="font-body text-lg text-physics-dark/60 mt-8 max-w-xl leading-relaxed">
				{heroSubtitle ?? 'We are a community of curious minds dedicated to understanding the fundamental principles that govern our universe. From quantum mechanics to astrophysics, we explore it all.'}
			</p>
			<div class="mt-10 flex flex-wrap gap-4">
				<a
					href="/physics/events"
					class="inline-flex items-center px-8 py-3 bg-physics-blue text-white font-body text-sm font-medium rounded-full hover:bg-physics-blue/90 transition-colors no-underline"
				>
					{heroCta ?? 'View Events'}
				</a>
				<a
					href="/physics/about"
					class="inline-flex items-center px-8 py-3 border border-physics-dark/20 text-physics-dark font-body text-sm font-medium rounded-full hover:border-physics-blue hover:text-physics-blue transition-colors no-underline"
				>
					Learn More
				</a>
			</div>
		</div>
	</div>
</section>
