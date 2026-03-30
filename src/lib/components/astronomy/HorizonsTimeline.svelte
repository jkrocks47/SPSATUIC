<script lang="ts">
	import ScrollReveal from '$lib/components/astronomy/ScrollReveal.svelte';

	interface TimelineEvent {
		id: string;
		title: string;
		date: string;
		time: string | null;
		location: string | null;
		imageUrl?: string | null;
	}

	interface Props {
		events: TimelineEvent[];
	}

	let { events }: Props = $props();

	function formatDate(dateStr: string) {
		const d = new Date(dateStr + 'T00:00:00');
		return {
			month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
			day: d.getDate()
		};
	}
</script>

<!-- Torn edge transition: violent, fibrous tear revealing the physical world -->
<div class="relative" style="margin-top: -1px;">
	<svg
		class="torn-edge-svg"
		viewBox="0 0 1200 60"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<defs>
			<filter id="torn-shadow">
				<feDropShadow dx="0" dy="-3" stdDeviation="4" flood-color="#000" flood-opacity="0.3" />
			</filter>
			<!-- Paper fiber texture filter -->
			<filter id="fiber-texture">
				<feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
				<feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
			</filter>
		</defs>
		<!-- Main torn shape with more jagged, fibrous edges -->
		<path
			d="M0 60 L0 22 L8 24 L12 18 L18 21 L22 14 L28 19 L32 12 L38 16 L42 20 L48 11 L52 17 L58 13 L62 22 L68 15 L72 10 L78 18 L82 14 L88 21 L92 16 L98 12 L102 19 L108 15 L112 22 L118 13 L122 18 L128 10 L132 16 L138 20 L142 12 L148 17 L152 14 L158 22 L162 15 L168 11 L172 18 L178 13 L182 20 L188 16 L192 12 L198 19 L202 14 L208 22 L212 16 L218 11 L222 18 L228 14 L232 21 L238 15 L242 10 L248 17 L252 13 L258 20 L262 16 L268 12 L272 19 L278 14 L282 22 L288 15 L292 11 L298 18 L302 13 L308 20 L312 16 L318 12 L322 19 L328 14 L332 22 L338 16 L342 11 L348 18 L352 14 L358 21 L362 15 L368 10 L372 17 L378 13 L382 20 L388 16 L392 12 L398 19 L402 14 L408 22 L412 15 L418 11 L422 18 L428 13 L432 20 L438 16 L442 12 L448 19 L452 14 L458 22 L462 16 L468 11 L472 18 L478 14 L482 21 L488 15 L492 10 L498 17 L502 13 L508 20 L512 16 L518 12 L522 19 L528 14 L532 22 L538 15 L542 11 L548 18 L552 13 L558 20 L562 16 L568 12 L572 19 L578 14 L582 22 L588 16 L592 11 L598 18 L602 14 L608 21 L612 15 L618 10 L622 17 L628 13 L632 20 L638 16 L642 12 L648 19 L652 14 L658 22 L662 15 L668 11 L672 18 L678 13 L682 20 L688 16 L692 12 L698 19 L702 14 L708 22 L712 16 L718 11 L722 18 L728 14 L732 21 L738 15 L742 10 L748 17 L752 13 L758 20 L762 16 L768 12 L772 19 L778 14 L782 22 L788 15 L792 11 L798 18 L802 13 L808 20 L812 16 L818 12 L822 19 L828 14 L832 22 L838 16 L842 11 L848 18 L852 14 L858 21 L862 15 L868 10 L872 17 L878 13 L882 20 L888 16 L892 12 L898 19 L902 14 L908 22 L912 15 L918 11 L922 18 L928 13 L932 20 L938 16 L942 12 L948 19 L952 14 L958 22 L962 16 L968 11 L972 18 L978 14 L982 21 L988 15 L992 10 L998 17 L1002 13 L1008 20 L1012 16 L1018 12 L1022 19 L1028 14 L1032 22 L1038 15 L1042 11 L1048 18 L1052 13 L1058 20 L1062 16 L1068 12 L1072 19 L1078 14 L1082 22 L1088 16 L1092 11 L1098 18 L1102 14 L1108 21 L1112 15 L1118 10 L1122 17 L1128 13 L1132 20 L1138 16 L1142 12 L1148 19 L1152 14 L1158 22 L1162 15 L1168 11 L1172 18 L1178 13 L1182 20 L1188 16 L1192 12 L1198 18 L1200 20 L1200 60 Z"
			fill="#f5f0e8"
			filter="url(#torn-shadow)"
		/>
		<!-- Subtle fiber wisps along the torn edge -->
		<path
			d="M52 17 L54 9 M148 17 L150 8 M282 22 L285 14 M408 22 L411 13 M532 22 L534 14 M658 22 L661 13 M782 22 L785 14 M908 22 L911 13 M1032 22 L1035 14 M1158 22 L1160 14"
			stroke="#f5f0e8"
			stroke-width="0.8"
			opacity="0.6"
			fill="none"
		/>
	</svg>
</div>

<section class="relative bg-astro-cream py-28 px-4 overflow-hidden paper-texture">
	<!-- Noise texture overlay (enhanced paper grain) -->
	<div
		class="absolute inset-0 pointer-events-none opacity-[0.07]"
		style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;); background-size: 256px 256px;"
	></div>

	<!-- Halftone dot pattern overlay -->
	<div
		class="absolute inset-0 pointer-events-none opacity-[0.035]"
		style="background-image: radial-gradient(circle, #0a0a0f 0.8px, transparent 0.8px); background-size: 8px 8px;"
	></div>

	<!-- SVG halftone filter definition -->
	<svg class="absolute w-0 h-0" aria-hidden="true">
		<defs>
			<filter id="halftone" x="0" y="0" width="100%" height="100%">
				<feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
				<feComponentTransfer in="blur" result="posterize">
					<feFuncR type="discrete" tableValues="0 0.25 0.5 0.75 1" />
					<feFuncG type="discrete" tableValues="0 0.25 0.5 0.75 1" />
					<feFuncB type="discrete" tableValues="0 0.25 0.5 0.75 1" />
				</feComponentTransfer>
				<feColorMatrix type="saturate" values="0.2" />
				<feComponentTransfer>
					<feFuncR type="linear" slope="1.4" intercept="-0.15" />
					<feFuncG type="linear" slope="1.4" intercept="-0.15" />
					<feFuncB type="linear" slope="1.4" intercept="-0.15" />
				</feComponentTransfer>
			</filter>
		</defs>
	</svg>

	<div class="relative max-w-6xl mx-auto">
		<!-- Section title — left-aligned, brutalist -->
		<div class="mb-14">
			<h2 class="font-display font-bold text-cosmos-black text-2xl md:text-3xl uppercase tracking-[0.12em]">
				Upcoming Horizons
			</h2>
			<div class="mt-3 h-px w-24 bg-cosmos-black/20"></div>
		</div>

		{#if events.length === 0}
			<p class="text-center text-cosmos-black/50 font-body">No upcoming events at this time.</p>
		{:else}
			<!-- Timeline container -->
			<div class="relative">
				<!-- Orbital trajectory SVG line (desktop) -->
				<svg
					class="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none hidden md:block"
					viewBox="0 0 1000 100"
					preserveAspectRatio="none"
					fill="none"
				>
					<path
						d="M 0 60 Q 250 20, 500 50 T 1000 40"
						stroke="rgba(10,10,15,0.2)"
						stroke-width="2"
						stroke-dasharray="8 5"
						class="orbit-path"
					/>
					{#each events as _, i}
						{@const cx = (i + 0.5) * (1000 / events.length)}
						<circle
							cx={cx}
							cy={50 - 10 * Math.sin(cx * 0.006)}
							r="6"
							fill="none"
							stroke="rgba(10,10,15,0.3)"
							stroke-width="1.5"
						/>
						<circle
							cx={cx}
							cy={50 - 10 * Math.sin(cx * 0.006)}
							r="3"
							fill="rgba(10,10,15,0.35)"
						/>
					{/each}
				</svg>

				<!-- Events row -->
				<div class="flex flex-row gap-12 overflow-x-auto md:overflow-visible md:justify-center pb-4 snap-x snap-mandatory md:snap-none">
					{#each events as event, i}
						{@const { month, day } = formatDate(event.date)}
						<ScrollReveal delay={i * 150} class="flex-shrink-0 w-80 md:w-96 snap-center">
							<a href="/astronomy/events/{event.id}" class="no-underline block p-4 text-center transition-all duration-400 event-card-simple group">
								<!-- Circular image with geometric framing and halftone filter -->
								<div class="relative w-44 h-44 md:w-48 md:h-48 mx-auto mb-4 rounded-full overflow-hidden border-[3px] border-cosmos-black/12 shadow-lg event-circle">
									{#if event.imageUrl}
										<img
											src={event.imageUrl}
											alt={event.title}
											loading="lazy"
											class="w-full h-full object-cover halftone-img transition-all duration-700 group-hover:scale-110 group-hover:halftone-off"
										/>
									{:else}
										<div
											class="w-full h-full halftone-img transition-all duration-700 group-hover:halftone-off"
											style="background: radial-gradient(circle, rgba(79,70,229,0.3), rgba(168,85,247,0.2), rgba(10,10,15,0.8));"
										></div>
									{/if}

									<!-- Orbital ring on hover -->
									<div class="orbit-ring"></div>

									<!-- Date badge: dark brutalist overlapping the frame -->
									<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-cosmos-black text-astro-cream px-3 py-1 text-center leading-tight shadow-md transition-all duration-300 group-hover:bg-astro-indigo group-hover:shadow-lg">
										<span class="block font-mono text-[11px] tracking-wider">{month}</span>
										<span class="block font-display font-bold text-lg -mt-0.5">{String(day).padStart(2, '0')}</span>
									</div>
								</div>

								<!-- Title -->
								<h3 class="font-display font-bold text-cosmos-black text-center text-sm uppercase tracking-[0.08em] mt-8 mb-2 transition-colors duration-300 group-hover:text-astro-indigo">
									{event.title}
								</h3>

								<!-- Location + time -->
								<div class="text-center space-y-0.5">
									{#if event.time}
										<p class="font-mono text-xs text-cosmos-black/45 transition-colors duration-300 group-hover:text-cosmos-black/65">{event.time}</p>
									{/if}
									{#if event.location}
										<p class="font-body text-xs text-cosmos-black/45 transition-colors duration-300 group-hover:text-cosmos-black/65">{event.location}</p>
									{/if}
								</div>

								<!-- View prompt -->
								<p class="font-mono text-[10px] tracking-[0.2em] text-cosmos-black/0 mt-3 transition-all duration-300 group-hover:text-astro-indigo/60 view-prompt">
									VIEW DETAILS →
								</p>
							</a>
						</ScrollReveal>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<!-- Bottom torn edge: cream back to dark void -->
<div class="relative" style="margin-bottom: -1px;">
	<svg
		class="torn-edge-bottom"
		viewBox="0 0 1200 60"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<defs>
			<filter id="torn-shadow-bottom">
				<feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.25" />
			</filter>
		</defs>
		<path
			d="M0 0 L0 38 L8 36 L12 42 L18 39 L22 46 L28 41 L32 48 L38 44 L42 40 L48 49 L52 43 L58 47 L62 38 L68 45 L72 50 L78 42 L82 46 L88 39 L92 44 L98 48 L102 41 L108 45 L112 38 L118 47 L122 42 L128 50 L132 44 L138 40 L142 48 L148 43 L152 46 L158 38 L162 45 L168 49 L172 42 L178 47 L182 40 L188 44 L192 48 L198 41 L202 46 L208 38 L212 44 L218 49 L222 42 L228 46 L232 39 L238 45 L242 50 L248 43 L252 47 L258 40 L262 44 L268 48 L272 41 L278 46 L282 38 L288 45 L292 49 L298 42 L302 47 L308 40 L312 44 L318 48 L322 41 L328 46 L332 38 L338 44 L342 49 L348 42 L352 46 L358 39 L362 45 L368 50 L372 43 L378 47 L382 40 L388 44 L392 48 L398 41 L402 46 L408 38 L412 45 L418 49 L422 42 L428 47 L432 40 L438 44 L442 48 L448 41 L452 46 L458 38 L462 44 L468 49 L472 42 L478 46 L482 39 L488 45 L492 50 L498 43 L502 47 L508 40 L512 44 L518 48 L522 41 L528 46 L532 38 L538 45 L542 49 L548 42 L552 47 L558 40 L562 44 L568 48 L572 41 L578 46 L582 38 L588 44 L592 49 L598 42 L602 46 L608 39 L612 45 L618 50 L622 43 L628 47 L632 40 L638 44 L642 48 L648 41 L652 46 L658 38 L662 45 L668 49 L672 42 L678 47 L682 40 L688 44 L692 48 L698 41 L702 46 L708 38 L712 44 L718 49 L722 42 L728 46 L732 39 L738 45 L742 50 L748 43 L752 47 L758 40 L762 44 L768 48 L772 41 L778 46 L782 38 L788 45 L792 49 L798 42 L802 47 L808 40 L812 44 L818 48 L822 41 L828 46 L832 38 L838 44 L842 49 L848 42 L852 46 L858 39 L862 45 L868 50 L872 43 L878 47 L882 40 L888 44 L892 48 L898 41 L902 46 L908 38 L912 45 L918 49 L922 42 L928 47 L932 40 L938 44 L942 48 L948 41 L952 46 L958 38 L962 44 L968 49 L972 42 L978 46 L982 39 L988 45 L992 50 L998 43 L1002 47 L1008 40 L1012 44 L1018 48 L1022 41 L1028 46 L1032 38 L1038 45 L1042 49 L1048 42 L1052 47 L1058 40 L1062 44 L1068 48 L1072 41 L1078 46 L1082 38 L1088 44 L1092 49 L1098 42 L1102 46 L1108 39 L1112 45 L1118 50 L1122 43 L1128 47 L1132 40 L1138 44 L1142 48 L1148 41 L1152 46 L1158 38 L1162 45 L1168 49 L1172 42 L1178 47 L1182 40 L1188 44 L1192 48 L1198 42 L1200 38 L1200 0 Z"
			fill="#f5f0e8"
			filter="url(#torn-shadow-bottom)"
		/>
		<!-- Fiber wisps hanging down -->
		<path
			d="M52 43 L54 51 M148 43 L150 52 M282 38 L285 46 M408 38 L411 47 M532 38 L534 46 M658 38 L661 47 M782 38 L785 46 M908 38 L911 47 M1032 38 L1035 46 M1158 38 L1160 46"
			stroke="#f5f0e8"
			stroke-width="0.8"
			opacity="0.5"
			fill="none"
		/>
	</svg>
</div>

<style>
	.torn-edge-svg {
		display: block;
		width: 100%;
		height: 50px;
		position: relative;
		z-index: 5;
	}

	.torn-edge-bottom {
		display: block;
		width: 100%;
		height: 50px;
		position: relative;
		z-index: 5;
	}

	/* Halftone image filter: stylistic treatment */
	.halftone-img {
		filter: contrast(1.1) url(#halftone);
		transition: filter 0.5s ease;
	}

	/* Safari/iOS: CSS-only fallback — SVG filter chain blocks main thread */
	@supports (-webkit-touch-callout: none) {
		.halftone-img {
			filter: contrast(1.1) brightness(1.05);
		}
	}

	/* Sharpen on hover to reveal crisp image */
	.event-card-simple:hover .halftone-img {
		filter: contrast(1.05);
	}

	/* Event circle geometric framing */
	.event-circle {
		box-shadow:
			0 4px 12px rgba(0,0,0,0.1),
			0 0 0 1px rgba(10,10,15,0.06);
		transition: box-shadow 0.4s ease;
	}

	.event-card-simple:hover .event-circle {
		box-shadow:
			0 4px 20px rgba(79,70,229,0.2),
			0 0 0 1px rgba(79,70,229,0.15);
	}

	/* Orbit ring: dashed circle that spins on hover */
	.orbit-ring {
		position: absolute;
		inset: -6px;
		border-radius: 50%;
		border: 1px dashed rgba(79,70,229,0.4);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		z-index: 1;
	}

	.event-card-simple:hover .orbit-ring {
		opacity: 1;
		animation: spin 8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Event card hover */
	.event-card-simple {
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease;
	}

	.event-card-simple:hover {
		transform: translateY(-6px);
		filter: drop-shadow(0 8px 20px rgba(79,70,229,0.1));
	}

	/* View prompt slide-up */
	.view-prompt {
		transform: translateY(4px);
		transition: all 0.3s ease;
	}

	.event-card-simple:hover .view-prompt {
		transform: translateY(0);
	}

	/* Animated orbital path */
	.orbit-path {
		animation: orbit-flow 3s linear infinite;
	}

	@keyframes orbit-flow {
		0% { stroke-dashoffset: 0; }
		100% { stroke-dashoffset: -20; }
	}

	@media (prefers-reduced-motion: reduce) {
		.orbit-path { animation: none; }
		.event-card-simple { transition: none; }
		.event-card-simple:hover { transform: none; filter: none; }
		.orbit-ring { transition: none; }
		.event-card-simple:hover .orbit-ring { animation: none; }
		.halftone-img { transition: none; }
		.view-prompt { transition: none; }
	}
</style>
