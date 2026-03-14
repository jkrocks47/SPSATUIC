<script lang="ts">
	import type { RsvpStatus } from '$lib/utils/constants';

	let { data } = $props();

	let progressPercent = $derived(
		Math.min(100, (data.eventsAttended / data.activeThreshold) * 100)
	);
	let isActive = $derived(data.eventsAttended >= data.activeThreshold);

	let rsvpStatuses = $state<Record<string, RsvpStatus | null>>({});
	let rsvpLoading = $state<Record<string, boolean>>({});

	function getStatus(eventId: string, original: string | null): RsvpStatus | null {
		return rsvpStatuses[eventId] ?? (original as RsvpStatus | null);
	}

	async function changeRsvp(eventId: string, newStatus: RsvpStatus) {
		if (rsvpLoading[eventId]) return;
		rsvpLoading[eventId] = true;

		try {
			const res = await fetch('/api/member/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventId, status: newStatus })
			});
			if (res.ok) {
				rsvpStatuses[eventId] = newStatus;
			}
		} finally {
			rsvpLoading[eventId] = false;
		}
	}

	let expandedRsvp = $state<string | null>(null);

	function toggleRsvpPicker(eventId: string) {
		expandedRsvp = expandedRsvp === eventId ? null : eventId;
	}
</script>

<svelte:head>
	<title>Dashboard - UICSpacetime</title>
</svelte:head>

<div class="dashboard-overview">
	<h1 class="page-title">Welcome, {data.member.firstName}</h1>

	{#if data.needsPreferenceReview}
		<div class="review-banner">
			<span>It's been a while! Help us plan better events by reviewing your interests.</span>
			<a href="/dashboard/profile" class="review-btn">Update Interests &rarr;</a>
		</div>
	{/if}

	{#if data.member.adminRole}
		<a href="/admin" class="admin-link">Go to Admin Panel &rarr;</a>
	{/if}

	<div class="club-links">
		<a href="/astronomy" class="club-link astro-link">Astronomy Club &rarr;</a>
		<a href="/physics" class="club-link phys-link">Physics Club &rarr;</a>
	</div>

	<!-- Stats cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-label">Club Memberships</span>
			<div class="stat-clubs">
				{#if data.member.astronomyMember}<span class="club-tag astro">Astronomy</span>{/if}
				{#if data.member.physicsMember}<span class="club-tag phys">Physics</span>{/if}
			</div>
		</div>

		<div class="stat-card">
			<span class="stat-label">Events Attended</span>
			<span class="stat-value">{data.eventsAttended}</span>
		</div>

		<div class="stat-card">
			<span class="stat-label">Active Member Status</span>
			<div class="progress-section">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
				<span class="progress-text">
					{#if isActive}
						<span class="active-badge">Active</span>
					{:else}
						{data.eventsAttended} / {data.activeThreshold} events
					{/if}
				</span>
			</div>
		</div>
	</div>

	<!-- Interests -->
	<section class="section">
		<h2 class="section-title">Your Interests</h2>
		{#if data.eventPreferences.length === 0}
			<p class="empty">No interests selected. <a href="/dashboard/profile">Update your profile</a> to add some.</p>
		{:else}
			<div class="interests-list">
				{#each data.eventPreferences as interest}
					<span class="interest-tag">{interest}</span>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Upcoming RSVP'd events -->
	<section class="section">
		<h2 class="section-title">Upcoming Events</h2>
		{#if data.upcomingRsvps.length === 0}
			<p class="empty">No upcoming RSVPs. Browse <a href="/astronomy/events">Astronomy</a> or <a href="/physics/events">Physics</a> events to RSVP.</p>
		{:else}
			<div class="event-list">
				{#each data.upcomingRsvps as rsvp}
					{@const currentStatus = getStatus(rsvp.eventId, rsvp.rsvpStatus)}
					<div class="event-card">
						<a href="/{rsvp.clubType}/events/{rsvp.eventId}" class="event-row">
							<div class="event-info">
								<span class="event-title">{rsvp.title}</span>
								<span class="event-meta">{rsvp.date}{rsvp.time ? ` at ${rsvp.time}` : ''} &middot; {rsvp.location || 'TBD'}</span>
							</div>
							<div class="event-badges">
								<span class="club-mini" class:astro={rsvp.clubType === 'astronomy'} class:phys={rsvp.clubType === 'physics'}>{rsvp.clubType}</span>
							</div>
						</a>
						<div class="rsvp-controls">
							{#if expandedRsvp === rsvp.eventId}
								<div class="rsvp-picker">
									<button
										class="rsvp-opt going"
										class:active={currentStatus === 'going'}
										disabled={rsvpLoading[rsvp.eventId]}
										onclick={() => { changeRsvp(rsvp.eventId, 'going'); expandedRsvp = null; }}
									>Going</button>
									<button
										class="rsvp-opt maybe"
										class:active={currentStatus === 'maybe'}
										disabled={rsvpLoading[rsvp.eventId]}
										onclick={() => { changeRsvp(rsvp.eventId, 'maybe'); expandedRsvp = null; }}
									>Maybe</button>
									<button
										class="rsvp-opt not-going"
										class:active={currentStatus === 'not_going'}
										disabled={rsvpLoading[rsvp.eventId]}
										onclick={() => { changeRsvp(rsvp.eventId, 'not_going'); expandedRsvp = null; }}
									>Not Going</button>
								</div>
							{:else}
								<button
									class="rsvp-badge-btn"
									class:going={currentStatus === 'going'}
									class:maybe={currentStatus === 'maybe'}
									class:not-going={currentStatus === 'not_going'}
									onclick={() => toggleRsvpPicker(rsvp.eventId)}
									title="Change RSVP"
								>{currentStatus?.replace('_', ' ') ?? 'RSVP'}</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Recent check-ins -->
	<section class="section">
		<h2 class="section-title">Recent Check-ins</h2>
		{#if data.recentCheckins.length === 0}
			<p class="empty">No check-ins yet. Attend events and scan the QR code to check in!</p>
		{:else}
			<div class="event-list">
				{#each data.recentCheckins as checkin}
					<div class="event-row">
						<div class="event-info">
							<span class="event-title">{checkin.title}</span>
							<span class="event-meta">{checkin.date}</span>
						</div>
						<span class="club-mini" class:astro={checkin.clubType === 'astronomy'} class:phys={checkin.clubType === 'physics'}>{checkin.clubType}</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.dashboard-overview {
		max-width: 800px;
	}

	.admin-link {
		display: inline-block;
		margin-bottom: 1.5rem;
		padding: 0.5rem 1rem;
		background: rgba(79, 70, 229, 0.2);
		border: 1px solid rgba(79, 70, 229, 0.4);
		border-radius: 0.5rem;
		color: #c4b5fd;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.admin-link:hover {
		background: rgba(79, 70, 229, 0.35);
	}

	.club-links {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.club-link {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.astro-link {
		background: rgba(79, 70, 229, 0.15);
		border: 1px solid rgba(79, 70, 229, 0.3);
		color: #a5b4fc;
	}

	.astro-link:hover {
		background: rgba(79, 70, 229, 0.3);
	}

	.phys-link {
		background: rgba(14, 121, 178, 0.15);
		border: 1px solid rgba(14, 121, 178, 0.3);
		color: #7dd3fc;
	}

	.phys-link:hover {
		background: rgba(14, 121, 178, 0.3);
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	.stat-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
	}

	.stat-clubs {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.club-tag {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.65rem;
		border-radius: 9999px;
	}

	.club-tag.astro { background: rgba(79, 70, 229, 0.2); color: #a5b4fc; }
	.club-tag.phys { background: rgba(14, 121, 178, 0.2); color: #7dd3fc; }

	.progress-section {
		margin-top: 0.25rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.4rem;
	}

	.progress-fill {
		height: 100%;
		background: #4f46e5;
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.progress-text {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.active-badge {
		color: #22c55e;
		font-weight: 600;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 0.75rem;
	}

	.empty {
		font-size: 0.85rem;
		color: #6b7280;
	}

	.empty a {
		color: #818cf8;
		text-decoration: none;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		text-decoration: none;
		transition: background 0.15s;
	}

	a.event-row:hover {
		background: rgba(79, 70, 229, 0.08);
	}

	.event-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.event-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #e5e7eb;
	}

	.event-meta {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.event-badges {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.club-mini {
		font-size: 0.6rem;
		font-weight: 600;
		padding: 0.15rem 0.4rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.club-mini.astro { background: rgba(79, 70, 229, 0.2); color: #a5b4fc; }
	.club-mini.phys { background: rgba(14, 121, 178, 0.2); color: #7dd3fc; }

	.event-card {
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.event-card .event-row {
		border: none;
		background: none;
		border-radius: 0;
	}

	.rsvp-controls {
		padding: 0 1rem 0.65rem;
	}

	.rsvp-badge-btn {
		font-size: 0.65rem;
		font-weight: 500;
		padding: 0.2rem 0.55rem;
		border-radius: 9999px;
		text-transform: capitalize;
		cursor: pointer;
		border: 1px solid transparent;
		transition: all 0.15s;
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.5);
	}

	.rsvp-badge-btn:hover {
		border-color: rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.8);
	}

	.rsvp-badge-btn.going { background: rgba(34, 197, 94, 0.15); color: #86efac; border-color: rgba(34, 197, 94, 0.25); }
	.rsvp-badge-btn.maybe { background: rgba(234, 179, 8, 0.15); color: #fde047; border-color: rgba(234, 179, 8, 0.25); }
	.rsvp-badge-btn.not-going { background: rgba(220, 38, 38, 0.1); color: #fca5a5; border-color: rgba(220, 38, 38, 0.2); }

	.rsvp-picker {
		display: flex;
		gap: 0.35rem;
	}

	.rsvp-opt {
		font-size: 0.65rem;
		font-weight: 500;
		padding: 0.2rem 0.55rem;
		border-radius: 9999px;
		cursor: pointer;
		transition: all 0.15s;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.5);
	}

	.rsvp-opt:hover:not(:disabled) {
		color: rgba(255, 255, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.rsvp-opt:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.rsvp-opt.going.active { background: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.5); color: #86efac; }
	.rsvp-opt.maybe.active { background: rgba(234, 179, 8, 0.2); border-color: rgba(234, 179, 8, 0.5); color: #fde047; }
	.rsvp-opt.not-going.active { background: rgba(220, 38, 38, 0.15); border-color: rgba(220, 38, 38, 0.4); color: #fca5a5; }

	.interests-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.interest-tag {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.3rem 0.7rem;
		border-radius: 9999px;
		background: rgba(79, 70, 229, 0.12);
		border: 1px solid rgba(79, 70, 229, 0.25);
		color: #c4b5fd;
	}

	.review-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(234, 179, 8, 0.1);
		border: 1px solid rgba(234, 179, 8, 0.25);
		border-radius: 0.5rem;
		margin-bottom: 1.25rem;
		font-size: 0.85rem;
		color: #fde68a;
	}

	.review-btn {
		white-space: nowrap;
		padding: 0.35rem 0.75rem;
		background: rgba(234, 179, 8, 0.2);
		border: 1px solid rgba(234, 179, 8, 0.35);
		border-radius: 0.375rem;
		color: #fde68a;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.review-btn:hover {
		background: rgba(234, 179, 8, 0.35);
	}
</style>
