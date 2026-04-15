<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import { renderMarkdown } from '$lib/utils/markdown';
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
	import RSVPButtons from '$lib/components/shared/RSVPButtons.svelte';

	let { data } = $props();
	const event = $derived(data.event);
</script>

<svelte:head>
	<title>{event.title} | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-3xl mx-auto">
		<!-- Back Link -->
		<a
			href="/astronomy/events"
			class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] text-astro-indigo/80 hover:text-astro-indigo transition-colors no-underline mb-8"
		>
			<span>&larr;</span> BACK TO EVENTS
		</a>

		<!-- Hero Image -->
		{#if event.imageUrl}
			<div class="rounded-2xl overflow-hidden mb-8 glow-indigo">
				<img
					src={event.imageUrl}
					alt={event.title}
					class="w-full h-64 sm:h-96 object-cover"
					class:opacity-60={data.isPast}
				/>
			</div>
		{/if}

		<!-- Content -->
		<GlassPanel class="p-8 sm:p-12">
			{#if data.isPast}
				<div class="mb-6 pb-4 border-b border-white/10">
					<span class="font-mono text-xs tracking-[0.15em] px-3 py-1 rounded-full bg-astro-cream/10 text-astro-cream/40 border border-astro-cream/10">
						PAST EVENT
					</span>
				</div>
			{/if}

			<h1 class="font-display text-3xl sm:text-4xl font-bold text-astro-cream mb-6 chromatic-text">
				{event.title}
			</h1>

			<div class="flex flex-wrap gap-6 mb-8 pb-8 border-b border-white/10">
				<div>
					<p class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 mb-1">DATE</p>
					<p class="font-mono text-sm text-astro-cyan">{formatDate(event.date)}</p>
				</div>
				{#if event.time}
					<div>
						<p class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 mb-1">TIME</p>
						<p class="font-mono text-sm text-astro-cream/80">{event.time}</p>
					</div>
				{/if}
				{#if event.location}
					<div>
						<p class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 mb-1">LOCATION</p>
						{#if event.locationUrl}
							<a href={event.locationUrl} target="_blank" rel="noopener" class="font-mono text-sm text-astro-cyan hover:underline">{event.location}</a>
						{:else}
							<p class="font-mono text-sm text-astro-cream/80">{event.location}</p>
						{/if}
					</div>
				{/if}
			</div>

			{#if event.description}
				<div class="font-body text-base text-astro-cream/70 leading-relaxed prose-description">
					{@html renderMarkdown(event.description)}
				</div>
			{/if}

			<!-- RSVP Buttons -->
			{#if !data.isPast}
				<RSVPButtons
					eventId={event.id}
					currentStatus={data.memberRsvp}
					isLoggedIn={data.isLoggedIn}
					isVerified={data.isVerified}
					redirectTo={`/astronomy/events/${event.id}`}
				/>
			{/if}
		</GlassPanel>
	</div>
</section>

<style>
	.prose-description :global(p) {
		margin: 0 0 0.75em;
	}
	.prose-description :global(p:last-child) {
		margin-bottom: 0;
	}
	.prose-description :global(a) {
		color: #22d3ee;
		text-decoration: underline;
	}
	.prose-description :global(a:hover) {
		color: #67e8f9;
	}
</style>
