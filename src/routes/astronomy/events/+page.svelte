<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">{data.content['page-subtitle'] ?? 'OBSERVE'}</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				{data.content['page-title'] ?? 'EVENTS'}
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- Upcoming Events -->
		{#if data.upcomingEvents.length === 0}
			<GlassPanel class="p-12 text-center">
				<p class="font-mono text-sm tracking-[0.15em] text-astro-cream/50">
					No upcoming events. Check back soon.
				</p>
			</GlassPanel>
		{:else}
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-6">UPCOMING</p>
			<div class="flex flex-col gap-6">
				{#each data.upcomingEvents as event}
					<a href="/astronomy/events/{event.id}" class="no-underline group event-card">
						<div class="event-panel">
							<!-- HUD Brackets -->
							<div class="hud-corner hud-tl"></div>
							<div class="hud-corner hud-tr"></div>
							<div class="hud-corner hud-bl"></div>
							<div class="hud-corner hud-br"></div>

							<div class="flex flex-col sm:flex-row">
								{#if event.imageUrl}
									<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden relative">
										<img
											src={event.imageUrl}
											alt={event.title}
											loading="lazy"
											class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div class="scan-sweep"></div>
										<div class="image-overlay"></div>
									</div>
								{/if}
								<div class="p-6 flex-1">
									<div class="flex items-start justify-between gap-4 mb-3">
										<h2 class="font-display text-xl font-bold text-astro-cream transition-all duration-300 group-hover:text-astro-cyan">
											{event.title}
										</h2>
										<span class="view-indicator font-mono text-[10px] tracking-[0.2em] text-astro-cyan/0 group-hover:text-astro-cyan/80 whitespace-nowrap mt-1">
											VIEW →
										</span>
									</div>
									<div class="flex flex-wrap gap-4 mb-4">
										<span class="font-mono text-xs tracking-[0.1em] text-astro-cyan/80 transition-colors duration-300 group-hover:text-astro-cyan">
											{formatDate(event.date)}
										</span>
										{#if event.time}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50 transition-colors duration-300 group-hover:text-astro-cream/70">
												{event.time}
											</span>
										{/if}
										{#if event.location}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50 transition-colors duration-300 group-hover:text-astro-cream/70">
												{event.location}
											</span>
										{/if}
									</div>
									{#if event.description}
										<p class="font-body text-sm text-astro-cream/60 line-clamp-2">
											{event.description}
										</p>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Past Events -->
		{#if data.pastEvents.length > 0}
			<div class="mt-16 mb-6">
				<div class="mx-auto w-full h-px bg-gradient-to-r from-transparent via-astro-indigo/30 to-transparent mb-8"></div>
				<p class="font-mono text-xs tracking-[0.3em] text-astro-cream/30">PAST EVENTS</p>
			</div>
			<div class="flex flex-col gap-6">
				{#each data.pastEvents as event}
					<a href="/astronomy/events/{event.id}" class="no-underline group event-card past">
						<div class="event-panel past-panel">
							<div class="flex flex-col sm:flex-row">
								{#if event.imageUrl}
									<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden relative">
										<img
											src={event.imageUrl}
											alt={event.title}
											loading="lazy"
											class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
										/>
										<div class="image-overlay"></div>
									</div>
								{/if}
								<div class="p-6 flex-1">
									<div class="flex items-start justify-between gap-4 mb-3">
										<h2 class="font-display text-xl font-bold text-astro-cream group-hover:text-astro-indigo transition-colors duration-300">
											{event.title}
										</h2>
										<span class="inline-block flex-shrink-0 font-mono text-[10px] tracking-[0.15em] px-2 py-0.5 rounded-full bg-astro-cream/10 text-astro-cream/40 border border-astro-cream/10">
											PAST EVENT
										</span>
									</div>
									<div class="flex flex-wrap gap-4 mb-4">
										<span class="font-mono text-xs tracking-[0.1em] text-astro-cyan/80">
											{formatDate(event.date)}
										</span>
										{#if event.time}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50">
												{event.time}
											</span>
										{/if}
										{#if event.location}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50">
												{event.location}
											</span>
										{/if}
									</div>
									{#if event.description}
										<p class="font-body text-sm text-astro-cream/60 line-clamp-2">
											{event.description}
										</p>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	/* Event Panel */
	.event-panel {
		position: relative;
		background: rgba(13, 27, 42, 0.6);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		backdrop-filter: blur(12px) saturate(180%);
		border: 1px solid rgba(79, 70, 229, 0.15);
		border-radius: 1rem;
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.event-card:hover .event-panel {
		border-color: rgba(34, 211, 238, 0.35);
		box-shadow:
			0 0 20px rgba(79, 70, 229, 0.2),
			0 0 40px rgba(34, 211, 238, 0.08),
			0 8px 32px rgba(0, 0, 0, 0.3);
		transform: translateY(-2px);
	}

	/* Past events are dimmed */
	.event-card.past { opacity: 0.5; transition: opacity 0.3s ease; }
	.event-card.past:hover { opacity: 0.75; }
	.event-card.past:hover .event-panel {
		border-color: rgba(79, 70, 229, 0.3);
		box-shadow: 0 0 15px rgba(79, 70, 229, 0.12), 0 4px 16px rgba(0, 0, 0, 0.2);
		transform: translateY(-1px);
	}

	/* HUD Corner Brackets */
	.hud-corner {
		position: absolute;
		width: 14px;
		height: 14px;
		z-index: 10;
		opacity: 0;
		transition: opacity 0.3s ease 0.1s;
	}

	.event-card:hover .hud-corner { opacity: 1; }

	.hud-tl {
		top: 6px; left: 6px;
		border-top: 1px solid rgba(34, 211, 238, 0.6);
		border-left: 1px solid rgba(34, 211, 238, 0.6);
	}
	.hud-tr {
		top: 6px; right: 6px;
		border-top: 1px solid rgba(34, 211, 238, 0.6);
		border-right: 1px solid rgba(34, 211, 238, 0.6);
	}
	.hud-bl {
		bottom: 6px; left: 6px;
		border-bottom: 1px solid rgba(34, 211, 238, 0.6);
		border-left: 1px solid rgba(34, 211, 238, 0.6);
	}
	.hud-br {
		bottom: 6px; right: 6px;
		border-bottom: 1px solid rgba(34, 211, 238, 0.6);
		border-right: 1px solid rgba(34, 211, 238, 0.6);
	}

	/* Scan line sweep over image */
	.scan-sweep {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(34, 211, 238, 0.12) 45%,
			rgba(79, 70, 229, 0.08) 55%,
			transparent 100%
		);
		height: 40%;
		transform: translateY(-100%);
		z-index: 5;
		pointer-events: none;
	}

	.event-card:hover .scan-sweep {
		animation: sweep 1.2s ease-in-out forwards;
	}

	@keyframes sweep {
		0% { transform: translateY(-100%); opacity: 0; }
		20% { opacity: 1; }
		100% { transform: translateY(350%); opacity: 0; }
	}

	/* Overlay tint on image */
	.image-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(79, 70, 229, 0) 0%, rgba(79, 70, 229, 0) 100%);
		transition: background 0.4s ease;
		z-index: 2;
		pointer-events: none;
	}

	.event-card:hover .image-overlay {
		background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(34, 211, 238, 0.05) 100%);
	}

	/* View indicator */
	.view-indicator {
		transform: translateX(8px);
		transition: all 0.3s ease;
	}

	.event-card:hover .view-indicator {
		transform: translateX(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.event-panel { transition: none; }
		.event-card:hover .event-panel { transform: none; }
		.event-card:hover .scan-sweep { animation: none; }
		.hud-corner { transition: none; }
		.view-indicator { transition: none; }
		.event-card.past { transition: none; }
	}
</style>
