<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import RSVPButtons from '$lib/components/shared/RSVPButtons.svelte';

	let { data } = $props();
	const event = $derived(data.event);
</script>

<svelte:head>
	<title>{event.title} | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-3xl mx-auto">
		<!-- Back Link -->
		<a
			href="/physics/events"
			class="inline-flex items-center gap-2 font-body text-xs tracking-widest text-physics-blue/70 hover:text-physics-blue uppercase transition-colors no-underline mb-8"
		>
			<span>&larr;</span> BACK TO EVENTS
		</a>

		<!-- Hero Image -->
		{#if event.imageUrl}
			<div class="rounded-2xl overflow-hidden mb-8">
				<img
					src={event.imageUrl}
					alt={event.title}
					class="w-full h-64 sm:h-96 object-cover"
					class:grayscale={data.isPast}
				/>
			</div>
		{/if}

		<!-- Content -->
		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12">
			{#if data.isPast}
				<div class="mb-6 pb-4 border-b border-gray-100">
					<span class="font-body text-[10px] tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200 uppercase">
						Past Event
					</span>
				</div>
			{/if}

			<h1 class="font-display text-3xl sm:text-4xl font-bold text-physics-dark mb-6">
				{event.title}
			</h1>

			<div class="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-100">
				<div>
					<p class="font-body text-[10px] tracking-widest text-physics-dark/40 uppercase mb-1">Date</p>
					<p class="font-body text-sm text-physics-blue font-medium">{formatDate(event.date)}</p>
				</div>
				{#if event.time}
					<div>
						<p class="font-body text-[10px] tracking-widest text-physics-dark/40 uppercase mb-1">Time</p>
						<p class="font-body text-sm text-physics-dark/80">{event.time}</p>
					</div>
				{/if}
				{#if event.location}
					<div>
						<p class="font-body text-[10px] tracking-widest text-physics-dark/40 uppercase mb-1">Location</p>
						{#if event.locationUrl}
							<a href={event.locationUrl} target="_blank" rel="noopener" class="font-body text-sm text-physics-blue hover:underline">{event.location}</a>
						{:else}
							<p class="font-body text-sm text-physics-dark/80">{event.location}</p>
						{/if}
					</div>
				{/if}
			</div>

			{#if !data.isPast}
				<!-- RSVP counts -->
				{#if data.rsvpCounts.going > 0 || data.rsvpCounts.maybe > 0}
					<div class="flex gap-3 mb-4">
						{#if data.rsvpCounts.going > 0}
							<span class="text-xs text-green-600/70 font-medium">{data.rsvpCounts.going} going</span>
						{/if}
						{#if data.rsvpCounts.maybe > 0}
							<span class="text-xs text-yellow-600/70 font-medium">{data.rsvpCounts.maybe} maybe</span>
						{/if}
					</div>
				{/if}
			{/if}

			{#if event.description}
				<div class="font-body text-base text-physics-dark/70 leading-relaxed whitespace-pre-wrap">
					{event.description}
				</div>
			{/if}

			<!-- RSVP Buttons (physics theme override) -->
			{#if !data.isPast}
				<div class="physics-rsvp">
					<RSVPButtons
						eventId={event.id}
						currentStatus={data.memberRsvp}
						isLoggedIn={data.isLoggedIn}
						isVerified={data.isVerified}
						redirectTo={`/physics/events/${event.id}`}
					/>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.physics-rsvp :global(.rsvp-buttons) {
		border-top-color: #e5e7eb;
	}

	.physics-rsvp :global(.rsvp-label) {
		color: rgba(25, 25, 35, 0.4);
	}

	.physics-rsvp :global(.rsvp-btn) {
		background: rgba(0, 0, 0, 0.03);
		border-color: #e5e7eb;
		color: rgba(25, 25, 35, 0.5);
	}

	.physics-rsvp :global(.rsvp-btn:hover:not(:disabled)) {
		border-color: #d1d5db;
		color: rgba(25, 25, 35, 0.8);
	}

	.physics-rsvp :global(.rsvp-login-link) {
		color: #0e79b2;
	}
</style>
