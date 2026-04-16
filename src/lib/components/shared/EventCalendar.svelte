<script lang="ts">
	import { getCalendarDays, isToday, formatShortDate } from '$lib/utils/dates';

	interface CalendarEvent {
		id: string;
		title: string;
		description: string | null;
		date: string;
		time: string | null;
		location: string | null;
		clubType: string;
		imageUrl: string | null;
	}

	let {
		events = []
	}: {
		events: CalendarEvent[];
	} = $props();

	let now = new Date();
	let currentYear = $state(now.getFullYear());
	let currentMonth = $state(now.getMonth());
	let selectedDay = $state<number | null>(null);
	let activeFilter = $state<'all' | 'astronomy' | 'physics'>('all');

	let days = $derived(getCalendarDays(currentYear, currentMonth));

	let monthLabel = $derived(
		new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	let eventDayMap = $derived.by(() => {
		const map = new Map<number, { astronomy: boolean; physics: boolean }>();
		for (const ev of events) {
			const d = new Date(ev.date + 'T00:00:00');
			if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
				const day = d.getDate();
				const existing = map.get(day) || { astronomy: false, physics: false };
				if (ev.clubType === 'astronomy') existing.astronomy = true;
				if (ev.clubType === 'physics') existing.physics = true;
				map.set(day, existing);
			}
		}
		return map;
	});

	// When no day selected, show all upcoming events; when a day is selected, show that day's events
	let filteredEvents = $derived.by(() => {
		let filtered = events;
		if (activeFilter !== 'all') {
			filtered = filtered.filter((e) => e.clubType === activeFilter);
		}
		if (selectedDay !== null) {
			filtered = filtered.filter((e) => {
				const d = new Date(e.date + 'T00:00:00');
				return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === selectedDay;
			});
		}
		return filtered;
	});

	function prevMonth() {
		if (currentMonth === 0) { currentMonth = 11; currentYear--; }
		else { currentMonth--; }
		selectedDay = null;
	}

	function nextMonth() {
		if (currentMonth === 11) { currentMonth = 0; currentYear++; }
		else { currentMonth++; }
		selectedDay = null;
	}

	function selectDay(day: number) {
		selectedDay = selectedDay === day ? null : day;
	}

	function eventDetailUrl(event: CalendarEvent): string {
		return `/${event.clubType}/events/${event.id}`;
	}

	const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
</script>

<section class="calendar-section">
	<!-- Filter pills -->
	<div class="filter-row">
		<button class="filter-pill" class:active={activeFilter === 'all'} onclick={() => (activeFilter = 'all')}>All</button>
		<button class="filter-pill" class:active={activeFilter === 'astronomy'} onclick={() => (activeFilter = 'astronomy')}>Astronomy</button>
		<button class="filter-pill" class:active={activeFilter === 'physics'} onclick={() => (activeFilter = 'physics')}>Physics</button>
	</div>

	<div class="calendar-layout">
		<!-- Calendar grid -->
		<div class="calendar-grid-wrapper">
			<div class="calendar-nav">
				<button onclick={prevMonth} aria-label="Previous month">&larr;</button>
				<span class="month-label">{monthLabel}</span>
				<button onclick={nextMonth} aria-label="Next month">&rarr;</button>
			</div>

			<div class="weekday-row">
				{#each weekdays as wd}
					<span class="weekday-cell">{wd}</span>
				{/each}
			</div>

			<div class="days-grid">
				{#each days as day}
					{#if day === null}
						<span class="day-cell empty"></span>
					{:else}
						{@const info = eventDayMap.get(day)}
						{@const hasAstro = info?.astronomy ?? false}
						{@const hasPhys = info?.physics ?? false}
						{@const hasBoth = hasAstro && hasPhys}
						{@const hasAny = hasAstro || hasPhys}
						{@const todayCheck = isToday(new Date(currentYear, currentMonth, day))}
						<button
							class="day-cell"
							class:today={todayCheck}
							class:has-astro={hasAstro && !hasBoth}
							class:has-phys={hasPhys && !hasBoth}
							class:has-both={hasBoth}
							class:has-events={hasAny}
							class:selected={selectedDay === day}
							onclick={() => selectDay(day)}
							aria-label="{day}{hasAny ? ' (has events)' : ''}"
						>
							<span class="day-number">{day}</span>
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Event detail panel -->
		<div class="detail-panel">
			{#if selectedDay !== null}
				<p class="panel-heading">Events on {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
			{:else}
				<p class="panel-heading">Upcoming Events</p>
			{/if}

			{#if filteredEvents.length > 0}
				{#each filteredEvents as event}
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
						</div>
					</a>
				{/each}
			{:else}
				<div class="empty-state">
					<p>{selectedDay !== null ? 'No events on this day' : 'No upcoming events'}</p>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.calendar-section {
		max-width: 64rem;
		margin: 0 auto;
		padding: 0.5rem 0 3rem;
	}

	.filter-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
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

	.calendar-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		align-items: start;
	}

	/* Calendar grid */
	.calendar-grid-wrapper {
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(245, 240, 232, 0.08);
		border-radius: 16px;
		padding: 1.5rem;
	}

	.calendar-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.calendar-nav button {
		background: none; border: none;
		color: #8892A4; font-size: 1rem;
		cursor: pointer; padding: 0.25rem 0.5rem;
		border-radius: 4px; transition: color 0.2s ease;
	}
	.calendar-nav button:hover { color: #f5f0e8; }

	.month-label {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.05rem; font-weight: 600;
		color: #f5f0e8; letter-spacing: 0.05em;
	}

	.weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px; margin-bottom: 4px;
	}
	.weekday-cell {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem; color: #8892A4;
		text-align: center; padding: 0.3rem 0;
		letter-spacing: 0.05em;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 3px;
	}

	.day-cell {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		border: none;
		background: transparent;
		cursor: pointer;
		position: relative;
		transition: all 0.2s ease;
	}
	.day-cell.empty { cursor: default; }

	.day-number {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		color: rgba(245, 240, 232, 0.5);
		line-height: 1;
	}

	.day-cell:not(.empty):hover {
		background: rgba(245, 240, 232, 0.06);
	}

	/* Today */
	.day-cell.today {
		box-shadow: inset 0 0 0 1.5px #CE1126;
	}
	.day-cell.today .day-number {
		color: #CE1126; font-weight: 700;
	}

	/* Selected */
	.day-cell.selected {
		background: rgba(245, 240, 232, 0.12) !important;
	}
	.day-cell.selected .day-number { color: #fff; font-weight: 700; }

	/* Event day number brightens */
	.day-cell.has-events .day-number { color: #f5f0e8; }

	/* ---- GLOWING EVENT DAYS ---- */
	.day-cell.has-astro {
		background: rgba(168, 85, 247, 0.1);
		box-shadow: 0 0 10px rgba(168, 85, 247, 0.12), inset 0 0 0 1px rgba(168, 85, 247, 0.2);
		animation: glow-astro 3s ease-in-out infinite;
	}
	.day-cell.has-astro .day-number { color: #c4b5fd; }
	.day-cell.has-astro:hover {
		background: rgba(168, 85, 247, 0.18);
		box-shadow: 0 0 14px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(168, 85, 247, 0.3);
	}

	.day-cell.has-phys {
		background: rgba(206, 17, 38, 0.1);
		box-shadow: 0 0 10px rgba(206, 17, 38, 0.12), inset 0 0 0 1px rgba(206, 17, 38, 0.2);
		animation: glow-phys 3.5s ease-in-out infinite;
	}
	.day-cell.has-phys .day-number { color: #fca5a5; }
	.day-cell.has-phys:hover {
		background: rgba(206, 17, 38, 0.18);
		box-shadow: 0 0 14px rgba(206, 17, 38, 0.2), inset 0 0 0 1px rgba(206, 17, 38, 0.3);
	}

	.day-cell.has-both {
		background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(206, 17, 38, 0.1));
		box-shadow: 0 0 10px rgba(168, 85, 247, 0.08), 0 0 10px rgba(206, 17, 38, 0.08),
			inset 0 0 0 1px rgba(200, 100, 200, 0.15);
		animation: glow-both 3s ease-in-out infinite;
	}
	.day-cell.has-both .day-number { color: #e0d5ff; }
	.day-cell.has-both:hover {
		background: linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(206, 17, 38, 0.18));
	}

	@keyframes glow-astro {
		0%, 100% { box-shadow: 0 0 8px rgba(168,85,247,0.08), inset 0 0 0 1px rgba(168,85,247,0.15); }
		50% { box-shadow: 0 0 14px rgba(168,85,247,0.18), inset 0 0 0 1px rgba(168,85,247,0.28); }
	}
	@keyframes glow-phys {
		0%, 100% { box-shadow: 0 0 8px rgba(206,17,38,0.08), inset 0 0 0 1px rgba(206,17,38,0.15); }
		50% { box-shadow: 0 0 14px rgba(206,17,38,0.18), inset 0 0 0 1px rgba(206,17,38,0.28); }
	}
	@keyframes glow-both {
		0%, 100% { box-shadow: 0 0 8px rgba(168,85,247,0.06), 0 0 8px rgba(206,17,38,0.06), inset 0 0 0 1px rgba(200,100,200,0.1); }
		50% { box-shadow: 0 0 14px rgba(168,85,247,0.12), 0 0 14px rgba(206,17,38,0.12), inset 0 0 0 1px rgba(200,100,200,0.22); }
	}

	/* ---- DETAIL PANEL ---- */
	.detail-panel {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 200px;
		max-height: 500px;
		overflow-y: auto;
	}

	.panel-heading {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.85rem; font-weight: 600;
		color: rgba(245,240,232,0.5);
		letter-spacing: 0.03em;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid rgba(245,240,232,0.06);
	}

	.empty-state {
		display: flex; align-items: center; justify-content: center;
		min-height: 200px;
		background: rgba(13, 27, 42, 0.3);
		border: 1px dashed rgba(245, 240, 232, 0.06);
		border-radius: 16px;
	}
	.empty-state p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem; color: rgba(245,240,232,0.25);
		letter-spacing: 0.05em;
	}

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

	/* Club-specific hover glows */
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

	.event-card:focus-visible {
		outline: 2px solid rgba(206, 17, 38, 0.6);
		outline-offset: 2px;
	}

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
		letter-spacing: 0.02em;
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
		font-size: 0.5rem; letter-spacing: 0.15em;
		padding: 0.1rem 0.4rem; border-radius: 9999px;
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

	/* Mobile */
	@media (max-width: 768px) {
		.calendar-section { padding: 0.5rem 0 2rem; }
		.calendar-layout { grid-template-columns: 1fr; }
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

	@media (prefers-reduced-motion: reduce) {
		.filter-pill, .event-card, .day-cell, .calendar-nav button, .event-title { transition: none; }
		.day-cell.has-astro, .day-cell.has-phys, .day-cell.has-both { animation: none; }
		.event-card:hover { transform: none; }
	}
</style>
