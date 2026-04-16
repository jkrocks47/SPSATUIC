<script lang="ts">
	import { getCalendarDays, isToday, formatShortDate } from '$lib/utils/dates';

	let { data } = $props();
	let activeFilter = $state<'all' | 'astronomy' | 'physics'>('all');

	const months = Array.from({ length: 12 }, (_, i) => i);
	const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

	function monthName(month: number): string {
		return new Date(data.year, month).toLocaleDateString('en-US', { month: 'long' });
	}

	// Build event-day maps for each month
	let eventMonthMaps = $derived.by(() => {
		const maps = new Map<number, Map<number, { astronomy: boolean; physics: boolean }>>();
		for (const ev of data.allEvents) {
			if (activeFilter !== 'all' && ev.clubType !== activeFilter) continue;
			const d = new Date(ev.date + 'T00:00:00');
			if (d.getFullYear() !== data.year) continue;
			const month = d.getMonth();
			const day = d.getDate();
			if (!maps.has(month)) maps.set(month, new Map());
			const monthMap = maps.get(month)!;
			const existing = monthMap.get(day) || { astronomy: false, physics: false };
			if (ev.clubType === 'astronomy') existing.astronomy = true;
			if (ev.clubType === 'physics') existing.physics = true;
			monthMap.set(day, existing);
		}
		return maps;
	});

	let filteredUpcoming = $derived(
		activeFilter === 'all'
			? data.upcomingEvents
			: data.upcomingEvents.filter((e: { clubType: string }) => e.clubType === activeFilter)
	);

	let filteredPast = $derived(
		activeFilter === 'all'
			? data.pastEvents
			: data.pastEvents.filter((e: { clubType: string }) => e.clubType === activeFilter)
	);

	function eventDetailUrl(event: { id: string; clubType: string }): string {
		return `/${event.clubType}/events/${event.id}`;
	}
</script>

<svelte:head>
	<title>All Events — UICSpacetime</title>
	<meta name="description" content="Full year calendar of events for UIC Society of Physics Students" />
</svelte:head>

<div class="page">
	<header class="page-header">
		<a href="/" class="back-link">&larr; Home</a>
		<p class="page-subtitle">SOCIETY OF PHYSICS STUDENTS</p>
		<h1 class="page-title">All Events</h1>
		<p class="page-year">{data.year}</p>
		<div class="title-divider" aria-hidden="true"></div>
	</header>

	<main class="page-content">
		<!-- Filter pills -->
		<div class="filter-row">
			<button class="filter-pill" class:active={activeFilter === 'all'} onclick={() => (activeFilter = 'all')}>All</button>
			<button class="filter-pill" class:active={activeFilter === 'astronomy'} onclick={() => (activeFilter = 'astronomy')}>Astronomy</button>
			<button class="filter-pill" class:active={activeFilter === 'physics'} onclick={() => (activeFilter = 'physics')}>Physics</button>
		</div>

		<!-- Year calendar grid -->
		<div class="year-grid">
			{#each months as month}
				{@const days = getCalendarDays(data.year, month)}
				{@const monthMap = eventMonthMaps.get(month)}
				<div class="mini-month">
					<h3 class="mini-month-name">{monthName(month)}</h3>
					<div class="mini-weekday-row">
						{#each weekdays as wd}
							<span class="mini-weekday">{wd}</span>
						{/each}
					</div>
					<div class="mini-days-grid">
						{#each days as day}
							{#if day === null}
								<span class="mini-day empty"></span>
							{:else}
								{@const info = monthMap?.get(day)}
								{@const hasAstro = info?.astronomy ?? false}
								{@const hasPhys = info?.physics ?? false}
								{@const hasBoth = hasAstro && hasPhys}
								{@const hasAny = hasAstro || hasPhys}
								{@const todayCheck = isToday(new Date(data.year, month, day))}
								<span
									class="mini-day"
									class:today={todayCheck}
									class:has-astro={hasAstro && !hasBoth}
									class:has-phys={hasPhys && !hasBoth}
									class:has-both={hasBoth}
									class:has-events={hasAny}
								>
									{day}
								</span>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Upcoming events -->
		{#if filteredUpcoming.length > 0}
			<section class="events-section">
				<h2 class="section-heading">Upcoming Events</h2>
				<div class="events-list">
					{#each filteredUpcoming as event}
						{@const shortDate = formatShortDate(event.date)}
						<a
							href={eventDetailUrl(event)}
							class="event-card"
							class:astro-border={event.clubType === 'astronomy'}
							class:phys-border={event.clubType === 'physics'}
							data-sveltekit-preload-data="hover"
						>
							<div class="event-date-rail" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'}>
								<span class="date-month">{shortDate.month}</span>
								<span class="date-day">{shortDate.day}</span>
							</div>
							{#if event.imageUrl}
								<img src={event.imageUrl} alt="" class="event-thumb" loading="lazy" />
							{:else}
								<div class="event-thumb event-thumb-placeholder" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'} aria-hidden="true">
									<span>{event.clubType === 'astronomy' ? 'A' : 'P'}</span>
								</div>
							{/if}
							<div class="event-body">
								<span class="club-badge" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'}>
									{event.clubType === 'astronomy' ? 'ASTRO' : 'PHYS'}
								</span>
								<h3 class="event-title">{event.title}</h3>
								{#if event.time || event.location}
									<p class="event-meta">
										{#if event.time}{event.time}{/if}
										{#if event.time && event.location} · {/if}
										{#if event.location}{event.location}{/if}
									</p>
								{/if}
								{#if event.description}
									<p class="event-desc">{event.description}</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Past events -->
		{#if filteredPast.length > 0}
			<section class="events-section past-section">
				<div class="section-divider" aria-hidden="true"></div>
				<h2 class="section-heading past-heading">Past Events</h2>
				<div class="events-list">
					{#each filteredPast as event}
						{@const shortDate = formatShortDate(event.date)}
						<a
							href={eventDetailUrl(event)}
							class="event-card past-card"
							class:astro-border={event.clubType === 'astronomy'}
							class:phys-border={event.clubType === 'physics'}
							data-sveltekit-preload-data="hover"
						>
							<div class="event-date-rail" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'}>
								<span class="date-month">{shortDate.month}</span>
								<span class="date-day">{shortDate.day}</span>
							</div>
							{#if event.imageUrl}
								<img src={event.imageUrl} alt="" class="event-thumb" loading="lazy" />
							{:else}
								<div class="event-thumb event-thumb-placeholder" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'} aria-hidden="true">
									<span>{event.clubType === 'astronomy' ? 'A' : 'P'}</span>
								</div>
							{/if}
							<div class="event-body">
								<span class="club-badge" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'}>
									{event.clubType === 'astronomy' ? 'ASTRO' : 'PHYS'}
								</span>
								<h3 class="event-title">{event.title}</h3>
								{#if event.time || event.location}
									<p class="event-meta">
										{#if event.time}{event.time}{/if}
										{#if event.time && event.location} · {/if}
										{#if event.location}{event.location}{/if}
									</p>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Empty state -->
		{#if filteredUpcoming.length === 0 && filteredPast.length === 0}
			<div class="empty-state">
				<p>No events found for {data.year}</p>
			</div>
		{/if}
	</main>

	<footer class="page-footer">
		<a href="/" class="back-link">&larr; Back to Home</a>
	</footer>
</div>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(160deg, #060e18 0%, #0d1b2a 30%, #1b2838 55%, #9B0A1A 90%, #CE1126 100%);
		padding: 2rem 1.5rem;
	}

	/* ---- HEADER ---- */
	.page-header {
		max-width: 64rem;
		margin: 0 auto 2.5rem;
		text-align: center;
	}
	.back-link {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: rgba(245, 240, 232, 0.4);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	.back-link:hover { color: #f5f0e8; }
	.page-subtitle {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem;
		letter-spacing: 0.3em;
		color: rgba(206, 17, 38, 0.6);
		margin-top: 1.5rem;
		margin-bottom: 0.4rem;
	}
	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2.4rem;
		font-weight: 700;
		color: #f5f0e8;
		letter-spacing: 0.02em;
	}
	.page-year {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		letter-spacing: 0.15em;
		color: rgba(245, 240, 232, 0.3);
		margin-top: 0.25rem;
	}
	.title-divider {
		margin: 1.5rem auto 0;
		width: 8rem;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(206, 17, 38, 0.35), transparent);
	}

	/* ---- CONTENT ---- */
	.page-content {
		max-width: 64rem;
		margin: 0 auto;
	}

	/* ---- FILTER PILLS ---- */
	.filter-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 2rem;
		justify-content: center;
	}
	.filter-pill {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.35rem 0.9rem;
		border-radius: 9999px;
		border: 1px solid rgba(245, 240, 232, 0.12);
		background: transparent;
		color: #8892A4;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.filter-pill:hover {
		border-color: rgba(206, 17, 38, 0.4);
		color: #f5f0e8;
	}
	.filter-pill.active {
		background: rgba(206, 17, 38, 0.15);
		border-color: #CE1126;
		color: #f5f0e8;
	}

	/* ---- YEAR GRID ---- */
	.year-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.mini-month {
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(245, 240, 232, 0.08);
		border-radius: 14px;
		padding: 1rem;
	}
	.mini-month-name {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.85rem;
		font-weight: 600;
		color: #f5f0e8;
		letter-spacing: 0.05em;
		margin-bottom: 0.6rem;
		text-align: center;
	}

	.mini-weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		margin-bottom: 2px;
	}
	.mini-weekday {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5rem;
		color: rgba(136, 146, 164, 0.6);
		text-align: center;
		padding: 0.15rem 0;
	}

	.mini-days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.mini-day {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem;
		color: rgba(245, 240, 232, 0.35);
		width: 100%;
		aspect-ratio: 1;
		border-radius: 4px;
		transition: background 0.2s ease;
	}
	.mini-day.empty { visibility: hidden; }

	.mini-day.today {
		box-shadow: inset 0 0 0 1px #CE1126;
		color: #CE1126;
		font-weight: 700;
	}
	.mini-day.has-events { color: #f5f0e8; }

	.mini-day.has-astro {
		background: rgba(168, 85, 247, 0.15);
		box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.25);
		color: #c4b5fd;
	}
	.mini-day.has-phys {
		background: rgba(206, 17, 38, 0.15);
		box-shadow: inset 0 0 0 1px rgba(206, 17, 38, 0.25);
		color: #fca5a5;
	}
	.mini-day.has-both {
		background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(206, 17, 38, 0.15));
		box-shadow: inset 0 0 0 1px rgba(200, 100, 200, 0.2);
		color: #e0d5ff;
	}

	/* ---- EVENTS SECTIONS ---- */
	.events-section { margin-bottom: 2.5rem; }
	.section-heading {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		color: #f5f0e8;
		letter-spacing: 0.03em;
		margin-bottom: 1rem;
	}
	.past-heading { color: rgba(245, 240, 232, 0.4); }
	.section-divider {
		width: 100%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(245, 240, 232, 0.08), transparent);
		margin-bottom: 1.5rem;
	}

	.events-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* ---- EVENT CARDS (same as EventCalendar) ---- */
	.event-card {
		position: relative;
		display: grid;
		grid-template-columns: 44px 64px 1fr;
		gap: 0.75rem;
		align-items: center;
		padding: 0.65rem 0.85rem 0.65rem 0;
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(245, 240, 232, 0.08);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			background 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.event-card.astro-border { border-left: 3px solid #a855f7; }
	.event-card.phys-border { border-left: 3px solid #CE1126; }

	.event-card.astro-border:hover {
		border-color: rgba(168, 85, 247, 0.25);
		box-shadow: 0 4px 24px rgba(168, 85, 247, 0.15), 0 0 12px rgba(168, 85, 247, 0.08);
		background: rgba(168, 85, 247, 0.04);
		transform: translateY(-2px);
	}
	.event-card.astro-border:hover .event-title { color: #c4b5fd; }

	.event-card.phys-border:hover {
		border-color: rgba(206, 17, 38, 0.25);
		box-shadow: 0 4px 24px rgba(206, 17, 38, 0.15), 0 0 12px rgba(206, 17, 38, 0.08);
		background: rgba(206, 17, 38, 0.04);
		transform: translateY(-2px);
	}
	.event-card.phys-border:hover .event-title { color: #fca5a5; }

	.event-card.past-card { opacity: 0.5; }
	.event-card.past-card:hover { opacity: 0.75; }

	.event-date-rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-family: 'JetBrains Mono', monospace;
		line-height: 1;
		padding: 0.25rem 0.25rem 0.25rem 0.6rem;
		border-right: 1px solid rgba(245, 240, 232, 0.06);
	}
	.date-month {
		font-size: 0.55rem;
		letter-spacing: 0.14em;
		color: #8892A4;
		margin-bottom: 0.2rem;
	}
	.date-day {
		font-size: 1.25rem;
		font-weight: 700;
		color: #f5f0e8;
	}
	.event-date-rail.astronomy .date-day { color: #c4b5fd; }
	.event-date-rail.physics .date-day { color: #fca5a5; }

	.event-thumb {
		width: 64px;
		height: 64px;
		object-fit: cover;
		display: block;
		border-radius: 8px;
		background: rgba(13, 27, 42, 0.8);
	}
	.event-thumb-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 600;
	}
	.event-thumb-placeholder.astronomy {
		background: linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(168, 85, 247, 0.08));
		color: #c4b5fd;
	}
	.event-thumb-placeholder.physics {
		background: linear-gradient(135deg, rgba(206, 17, 38, 0.25), rgba(206, 17, 38, 0.08));
		color: #fca5a5;
	}

	.event-body {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.club-badge {
		display: inline-block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.5rem;
		letter-spacing: 0.15em;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		font-weight: 600;
		align-self: flex-start;
	}
	.club-badge.astronomy { background: rgba(168, 85, 247, 0.15); color: #c4b5fd; }
	.club-badge.physics { background: rgba(206, 17, 38, 0.15); color: #E63946; }

	.event-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
		color: #f5f0e8;
		margin: 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		transition: color 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.event-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		color: #8892A4;
		letter-spacing: 0.03em;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.event-desc {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.78rem;
		color: rgba(245, 240, 232, 0.45);
		margin: 0.15rem 0 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* ---- EMPTY STATE ---- */
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		background: rgba(13, 27, 42, 0.3);
		border: 1px dashed rgba(245, 240, 232, 0.06);
		border-radius: 16px;
		margin-top: 2rem;
	}
	.empty-state p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: rgba(245, 240, 232, 0.25);
		letter-spacing: 0.05em;
	}

	/* ---- FOOTER ---- */
	.page-footer {
		max-width: 64rem;
		margin: 2rem auto 0;
		text-align: center;
		padding: 1.5rem 0;
		border-top: 1px solid rgba(245, 240, 232, 0.06);
	}

	/* ---- MOBILE ---- */
	@media (max-width: 1024px) {
		.year-grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 768px) {
		.page { padding: 1.25rem 0.75rem; }
		.page-title { font-size: 1.8rem; }
		.year-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
		.mini-month { padding: 0.75rem; }
		.mini-month-name { font-size: 0.75rem; }
		.mini-day { font-size: 0.55rem; }
		.event-card {
			grid-template-columns: 36px 48px 1fr;
			gap: 0.6rem;
			padding: 0.55rem 0.75rem 0.55rem 0;
		}
		.event-date-rail { padding-left: 0.45rem; }
		.date-month { font-size: 0.5rem; }
		.date-day { font-size: 1.05rem; }
		.event-thumb { width: 48px; height: 48px; }
		.event-thumb-placeholder { font-size: 1.2rem; }
		.event-title { font-size: 0.85rem; }
	}
	@media (max-width: 480px) {
		.year-grid { grid-template-columns: 1fr; }
	}

	@media (prefers-reduced-motion: reduce) {
		.filter-pill, .event-card, .event-title, .back-link { transition: none; }
		.event-card:hover { transform: none; }
	}
</style>
