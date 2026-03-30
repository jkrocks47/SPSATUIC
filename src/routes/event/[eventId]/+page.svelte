<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import RSVPButtons from '$lib/components/shared/RSVPButtons.svelte';

	let { data } = $props();
	const event = $derived(data.event);
	const isAstronomy = $derived(event.clubType === 'astronomy');
	const redirectPath = $derived(`/event/${event.id}`);
</script>

<svelte:head>
	<title>{event.title} | UIC Spacetime</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="landing" class:astronomy={isAstronomy} class:physics={!isAstronomy}>
	<div class="container">
		<!-- Club badge -->
		<div class="club-badge">
			{isAstronomy ? 'Astronomy Club' : 'Physics Club'}
		</div>

		<!-- Hero image -->
		{#if event.imageUrl}
			<div class="hero-image">
				<img src={event.imageUrl} alt={event.title} />
			</div>
		{/if}

		<!-- Event card -->
		<div class="event-card">
			{#if data.isPast}
				<span class="past-badge">Past Event</span>
			{/if}

			<h1 class="event-title">{event.title}</h1>

			<!-- Details -->
			<div class="details">
				<div class="detail-row">
					<span class="detail-icon">&#128197;</span>
					<span class="detail-text">{formatDate(event.date)}</span>
				</div>
				{#if event.time}
					<div class="detail-row">
						<span class="detail-icon">&#128336;</span>
						<span class="detail-text">{event.time}</span>
					</div>
				{/if}
				{#if event.location}
					<div class="detail-row">
						<span class="detail-icon">&#128205;</span>
						{#if event.locationUrl}
							<a href={event.locationUrl} target="_blank" rel="noopener" class="detail-link">{event.location}</a>
						{:else}
							<span class="detail-text">{event.location}</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- RSVP counts -->
			{#if !data.isPast && (data.rsvpCounts.going > 0 || data.rsvpCounts.maybe > 0)}
				<div class="rsvp-counts">
					{#if data.rsvpCounts.going > 0}
						<span class="count going">{data.rsvpCounts.going} going</span>
					{/if}
					{#if data.rsvpCounts.maybe > 0}
						<span class="count maybe">{data.rsvpCounts.maybe} maybe</span>
					{/if}
				</div>
			{/if}

			<!-- Description -->
			{#if event.description}
				<p class="description">{event.description}</p>
			{/if}

			<!-- CTA Area -->
			{#if !data.isPast}
				<div class="cta-area">
					{#if !data.isLoggedIn}
						<a href="/register?redirectTo={encodeURIComponent(redirectPath)}" class="cta-btn">
							Register & RSVP
						</a>
						<a href="/login?redirectTo={encodeURIComponent(redirectPath)}" class="sign-in-link">
							Already a member? Sign in
						</a>
					{:else if !data.isVerified}
						<div class="verify-msg">
							<p>Check your email to verify your account, then come back to RSVP.</p>
							<a href="/verify-email" class="verify-link">Go to verification</a>
						</div>
					{:else}
						<RSVPButtons
							eventId={event.id}
							currentStatus={data.memberRsvp}
							isLoggedIn={data.isLoggedIn}
							isVerified={data.isVerified}
							redirectTo={redirectPath}
						/>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Footer link -->
		<a href="/{event.clubType}/events/{event.id}" class="full-details-link">
			View full event details &rarr;
		</a>

		<div class="branding">
			<span class="brand-dot"></span>
			UIC Spacetime
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.landing {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		padding: 2rem 1rem;
	}

	.landing.astronomy {
		background: #0a0a0f;
		color: #f5f0e8;
	}

	.landing.physics {
		background: #f8fafc;
		color: #191923;
	}

	.container {
		width: 100%;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	/* Club badge */
	.club-badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.35rem 1rem;
		border-radius: 6px;
	}

	.astronomy .club-badge {
		color: #c4b5fd;
		border: 1px solid rgba(168, 85, 247, 0.4);
		background: rgba(168, 85, 247, 0.08);
	}

	.physics .club-badge {
		color: #0e79b2;
		border: 1px solid rgba(14, 121, 178, 0.3);
		background: rgba(14, 121, 178, 0.06);
	}

	/* Hero image */
	.hero-image {
		width: 100%;
		border-radius: 1rem;
		overflow: hidden;
	}

	.hero-image img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		display: block;
	}

	/* Event card */
	.event-card {
		width: 100%;
		border-radius: 1rem;
		padding: 1.75rem;
	}

	.astronomy .event-card {
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px) saturate(180%);
		-webkit-backdrop-filter: blur(12px) saturate(180%);
		border: 1px solid rgba(79, 70, 229, 0.15);
	}

	.physics .event-card {
		background: #ffffff;
		border: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	/* Past badge */
	.past-badge {
		display: inline-block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.2rem 0.6rem;
		border-radius: 9999px;
		margin-bottom: 1rem;
	}

	.astronomy .past-badge {
		background: rgba(245, 240, 232, 0.08);
		color: rgba(245, 240, 232, 0.4);
		border: 1px solid rgba(245, 240, 232, 0.1);
	}

	.physics .past-badge {
		background: #f3f4f6;
		color: #9ca3af;
	}

	/* Title */
	.event-title {
		font-family: 'Anton', Impact, sans-serif;
		font-size: 2rem;
		line-height: 1.1;
		letter-spacing: 1px;
		text-transform: uppercase;
		margin: 0 0 1.25rem;
	}

	.astronomy .event-title {
		background: linear-gradient(180deg, #ffffff 0%, #c4b5fd 80%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.physics .event-title {
		color: #191923;
	}

	/* Details */
	.details {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin-bottom: 1.25rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.physics .details {
		border-bottom-color: #e5e7eb;
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: 'Space Grotesk', sans-serif;
	}

	.detail-icon {
		font-size: 1rem;
		flex-shrink: 0;
	}

	.detail-text {
		font-size: 0.9rem;
		font-weight: 500;
	}

	.astronomy .detail-text {
		color: #e2e8f0;
	}

	.physics .detail-text {
		color: #374151;
	}

	.detail-link {
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
	}

	.astronomy .detail-link {
		color: #22d3ee;
	}

	.astronomy .detail-link:hover {
		text-decoration: underline;
	}

	.physics .detail-link {
		color: #0e79b2;
	}

	.physics .detail-link:hover {
		text-decoration: underline;
	}

	/* RSVP counts */
	.rsvp-counts {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.count {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
	}

	.count.going { color: #22c55e; }
	.count.maybe { color: #eab308; }

	.physics .count.going { color: #16a34a; }
	.physics .count.maybe { color: #ca8a04; }

	/* Description */
	.description {
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		line-height: 1.6;
		margin: 0;
		white-space: pre-wrap;
	}

	.astronomy .description {
		color: rgba(245, 240, 232, 0.6);
	}

	.physics .description {
		color: #6b7280;
	}

	/* CTA area */
	.cta-area {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.physics .cta-area {
		border-top-color: #e5e7eb;
	}

	.cta-btn {
		display: block;
		width: 100%;
		padding: 1rem;
		border-radius: 0.75rem;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.05rem;
		font-weight: 600;
		text-align: center;
		text-decoration: none;
		transition: background 0.15s;
	}

	.astronomy .cta-btn {
		background: #4f46e5;
		color: #ffffff;
	}

	.astronomy .cta-btn:hover {
		background: #4338ca;
	}

	.physics .cta-btn {
		background: #0e79b2;
		color: #ffffff;
	}

	.physics .cta-btn:hover {
		background: #0b6494;
	}

	.sign-in-link {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		text-decoration: none;
	}

	.astronomy .sign-in-link {
		color: rgba(245, 240, 232, 0.5);
	}

	.astronomy .sign-in-link:hover {
		color: #c4b5fd;
	}

	.physics .sign-in-link {
		color: #6b7280;
	}

	.physics .sign-in-link:hover {
		color: #0e79b2;
	}

	/* Verify message */
	.verify-msg {
		text-align: center;
	}

	.verify-msg p {
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		margin: 0 0 0.75rem;
	}

	.astronomy .verify-msg p {
		color: rgba(245, 240, 232, 0.6);
	}

	.physics .verify-msg p {
		color: #6b7280;
	}

	.verify-link {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.astronomy .verify-link {
		color: #818cf8;
	}

	.physics .verify-link {
		color: #0e79b2;
	}

	/* Footer link */
	.full-details-link {
		font-family: 'Inter', sans-serif;
		font-size: 0.8rem;
		text-decoration: none;
		transition: color 0.15s;
	}

	.astronomy .full-details-link {
		color: rgba(245, 240, 232, 0.35);
	}

	.astronomy .full-details-link:hover {
		color: #22d3ee;
	}

	.physics .full-details-link {
		color: #9ca3af;
	}

	.physics .full-details-link:hover {
		color: #0e79b2;
	}

	/* Branding */
	.branding {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-top: 0.5rem;
	}

	.astronomy .branding {
		color: rgba(245, 240, 232, 0.25);
	}

	.physics .branding {
		color: #9ca3af;
	}

	.brand-dot {
		width: 5px;
		height: 5px;
		background: #CE1126;
		border-radius: 50%;
		display: inline-block;
	}

	/* Mobile adjustments */
	@media (max-width: 480px) {
		.landing {
			padding: 1.25rem 0.75rem;
		}

		.event-card {
			padding: 1.25rem;
		}

		.astronomy .event-card {
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			background: rgba(13, 27, 42, 0.85);
		}
	}
</style>
