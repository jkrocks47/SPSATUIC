<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RsvpMemberDetail, EventStats } from '$lib/server/db/queries';
	import type { CheckinQuestion } from '$lib/server/db/schema';

	interface CheckinResponseRow {
		memberId: string;
		firstName: string;
		lastName: string;
		email: string;
		responses: Record<string, string | string[]> | null;
		checkedInAt: Date;
	}

	interface EmailedMember {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		sentAt: Date;
	}

	interface Props {
		event: {
			id: string;
			title: string;
			date: string;
			time: string | null;
			location: string | null;
			description: string | null;
			isPublished: boolean | null;
			rsvpRequired: boolean | null;
		};
		rsvpList: RsvpMemberDetail[];
		stats: EventStats;
		historicalRate: number | null;
		clubType: 'astronomy' | 'physics';
		backHref: string;
		announcementRecipientCount: number;
		announcementAlreadySent: boolean;
		excludedBreakdown?: { unverified: number; optedOut: number };
		emailedMembers?: EmailedMember[];
		checkinQuestions?: CheckinQuestion[];
		checkinResponses?: CheckinResponseRow[];
	}

	let { event, rsvpList, stats, historicalRate, clubType, backHref, announcementRecipientCount, announcementAlreadySent, excludedBreakdown = { unverified: 0, optedOut: 0 }, emailedMembers = [], checkinQuestions = [], checkinResponses = [] }: Props = $props();

	let excludedSummary = $derived.by(() => {
		const parts: string[] = [];
		if (excludedBreakdown.unverified > 0) parts.push(`${excludedBreakdown.unverified} unverified`);
		if (excludedBreakdown.optedOut > 0) parts.push(`${excludedBreakdown.optedOut} opted out`);
		return parts.length ? `(${parts.join(', ')})` : '';
	});

	let showResponses = $state(false);

	let hasResponseData = $derived(checkinQuestions.length > 0 && checkinResponses.some(r => r.responses && Object.keys(r.responses).length > 0));

	let announcementSending = $state(false);
	let announcementResult = $state<{ success?: boolean; sentCount?: number; error?: string } | null>(null);

	let correctionSending = $state(false);
	let correctionResult = $state<{ success?: boolean; sentCount?: number; error?: string } | null>(null);
	let correctionConfirming = $state(false);

	let rsvpReminderSending = $state(false);
	let rsvpReminderResult = $state<{ success?: boolean; sentCount?: number; error?: string } | null>(null);
	let rsvpReminderConfirming = $state(false);

	let announcementConfirming = $state(false);

	let statusFilter = $state<string>('all');
	let sortBy = $state<'name' | 'status' | 'reliability'>('name');
	let sortDir = $state<'asc' | 'desc'>('asc');

	function toggleSort(col: 'name' | 'status' | 'reliability') {
		if (sortBy === col) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = col;
			sortDir = 'asc';
		}
	}

	let filteredList = $derived.by(() => {
		let list =
			statusFilter === 'all'
				? rsvpList
				: rsvpList.filter((r) => r.status === statusFilter);

		list = [...list].sort((a, b) => {
			let cmp = 0;
			if (sortBy === 'name') {
				cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
			} else if (sortBy === 'status') {
				cmp = a.status.localeCompare(b.status);
			} else if (sortBy === 'reliability') {
				const aScore = a.reliabilityScore ?? -1;
				const bScore = b.reliabilityScore ?? -1;
				cmp = aScore - bScore;
			}
			return sortDir === 'desc' ? -cmp : cmp;
		});

		return list;
	});

	function reliabilityColor(score: number | null): string {
		if (score === null) return 'reliability-new';
		if (score >= 0.75) return 'reliability-high';
		if (score >= 0.5) return 'reliability-mid';
		return 'reliability-low';
	}

	function formatReliability(score: number | null): string {
		if (score === null) return 'New';
		return `${Math.round(score * 100)}%`;
	}

	function exportCheckinCsv() {
		const headers = ['First Name', 'Last Name', 'Email', 'Checked In At'];
		const sorted = [...checkinResponses].sort(
			(a, b) => new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()
		);
		const rows = sorted.map((r) => [
			r.firstName,
			r.lastName,
			r.email,
			new Date(r.checkedInAt).toLocaleString()
		]);
		const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_checkins.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportCsv() {
		const headers = ['First Name', 'Last Name', 'Email', 'RSVP Status', 'Reliability', 'Checked In'];
		const rows = rsvpList.map((r) => [
			r.firstName,
			r.lastName,
			r.email,
			r.status,
			r.reliabilityScore !== null ? `${Math.round(r.reliabilityScore * 100)}%` : 'N/A',
			r.checkedIn ? 'Yes' : 'No'
		]);
		const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_rsvps.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	const clubLabel = clubType === 'astronomy' ? 'Astronomy' : 'Physics';
</script>

<div class="detail-page">
	<div class="page-header">
		<a href={backHref} class="back-link">&larr; Back to Events</a>
		<div class="header-row">
			<h1 class="page-title">{event.title}</h1>
			<div class="header-badges">
				<span class="status-badge" class:published={event.isPublished} class:draft={!event.isPublished}>
					{event.isPublished ? 'Published' : 'Draft'}
				</span>
				{#if event.rsvpRequired}
					<span class="rsvp-required-badge">RSVP Required</span>
				{/if}
			</div>
		</div>
		<p class="event-meta">
			{event.date}
			{#if event.time}&middot; {event.time}{/if}
			{#if event.location}&middot; {event.location}{/if}
		</p>
	</div>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-value going">{stats.going}</span>
			<span class="stat-label">Going</span>
		</div>
		<div class="stat-card">
			<span class="stat-value maybe">{stats.maybe}</span>
			<span class="stat-label">Maybe</span>
		</div>
		<div class="stat-card">
			<span class="stat-value checkedin">{stats.checkedIn}</span>
			<span class="stat-label">Checked In</span>
		</div>
		<div class="stat-card">
			<span class="stat-value estimated">~{stats.turnout.estimated}</span>
			<span class="stat-label">Est. Turnout</span>
			{#if stats.turnout.highCount + stats.turnout.midCount + stats.turnout.excludedCount > 0}
				<span class="turnout-breakdown" title="High: ≥75% reliability; Mid: 50–75%; Excluded: <50%, not counted in estimate">
					{#if stats.turnout.highCount > 0}<span class="tier-pip high">{stats.turnout.highCount} high</span>{/if}
					{#if stats.turnout.midCount > 0}<span class="tier-pip mid">{stats.turnout.midCount} mid</span>{/if}
					{#if stats.turnout.excludedCount > 0}<span class="tier-pip excluded">{stats.turnout.excludedCount} excluded</span>{/if}
				</span>
			{/if}
		</div>
	</div>

	{#if historicalRate !== null}
		<div class="historical-rate">
			Historical turnout rate for {clubLabel} events: <strong>{historicalRate}%</strong>
		</div>
	{/if}

	<!-- Announcement Section -->
	<div class="announcement-card">
		<div class="announcement-header">
			<h2>Email Announcement</h2>
			{#if announcementAlreadySent}
				<span class="sent-badge">Sent</span>
			{/if}
		</div>

		{#if announcementResult?.success}
			<p class="announcement-success">Announcement sent to {announcementResult.sentCount} member{announcementResult.sentCount !== 1 ? 's' : ''}.</p>
		{/if}

		{#if announcementResult?.error}
			<p class="announcement-error">{announcementResult.error}</p>
		{/if}

		<p class="announcement-info">
			{#if announcementRecipientCount > 0}
				Send announcement to <strong>{announcementRecipientCount}</strong> verified {clubLabel} member{announcementRecipientCount !== 1 ? 's' : ''}.
			{:else}
				All eligible members have already been notified.
				{#if excludedSummary}
					<span class="excluded-info">{excludedSummary}</span>
				{/if}
			{/if}
		</p>

		{#if announcementRecipientCount > 0}
			{#if !announcementConfirming}
				<button
					class="announce-btn"
					onclick={() => announcementConfirming = true}
				>
					{announcementAlreadySent ? 'Send to New Members' : 'Send Announcement'}
				</button>
			{:else}
				<div class="confirm-box">
					<p class="confirm-text">Send announcement email to <strong>{announcementRecipientCount}</strong> member{announcementRecipientCount !== 1 ? 's' : ''}?</p>
					<div class="confirm-actions">
						<form method="POST" action="?/sendAnnouncement" use:enhance={() => {
							announcementSending = true;
							announcementResult = null;
							announcementConfirming = false;
							return async ({ result, update }) => {
								announcementSending = false;
								if (result.type === 'success') {
									announcementResult = { success: true, sentCount: result.data?.sentCount as number };
								} else if (result.type === 'failure') {
									announcementResult = { error: result.data?.error as string };
								}
								await update({ reset: false });
							};
						}}>
							<button type="submit" class="announce-btn" disabled={announcementSending}>
								{announcementSending ? 'Sending...' : 'Yes, Send'}
							</button>
						</form>
						<button class="cancel-btn" onclick={() => announcementConfirming = false}>Cancel</button>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Emailed Members -->
	{#if announcementAlreadySent}
		<div class="emailed-card">
			<div class="emailed-header">
				<div class="emailed-title">
					<span class="sent-dot" aria-hidden="true"></span>
					<h2>Emailed members ({emailedMembers.length})</h2>
				</div>
				{#if emailedMembers.length > 0}
					<span class="emailed-subtitle">
						Last sent {new Date(emailedMembers[emailedMembers.length - 1].sentAt).toLocaleString()}
					</span>
				{/if}
			</div>
			{#if emailedMembers.length > 0}
				<div class="emailed-scroll">
					<table class="data-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Sent At</th>
							</tr>
						</thead>
						<tbody>
							{#each emailedMembers as m}
								<tr>
									<td class="name-cell">{m.firstName} {m.lastName}</td>
									<td class="email-cell">{m.email}</td>
									<td>{new Date(m.sentAt).toLocaleString()}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="emailed-empty">No recipient log found for this event.</p>
			{/if}
		</div>
	{/if}

	<!-- Correction Section -->
	{#if announcementAlreadySent}
		<div class="announcement-card correction-card">
			<div class="announcement-header">
				<h2>Send Correction</h2>
			</div>

			{#if correctionResult?.success}
				<p class="announcement-success">Correction sent to {correctionResult.sentCount} member{correctionResult.sentCount !== 1 ? 's' : ''}.</p>
			{/if}

			{#if correctionResult?.error}
				<p class="announcement-error">{correctionResult.error}</p>
			{/if}

			<p class="announcement-info">
				Send a correction email with the current event details to all members who received the original announcement.
			</p>

			{#if !correctionConfirming}
				<button
					class="announce-btn correction-btn"
					onclick={() => correctionConfirming = true}
				>
					Send Correction
				</button>
			{:else}
				<div class="confirm-box">
					<p class="confirm-text">Send correction email to all members who received the original announcement?</p>
					<div class="confirm-actions">
						<form method="POST" action="?/sendCorrection" use:enhance={() => {
							correctionSending = true;
							correctionResult = null;
							correctionConfirming = false;
							return async ({ result, update }) => {
								correctionSending = false;
								if (result.type === 'success') {
									correctionResult = { success: true, sentCount: result.data?.sentCount as number };
								} else if (result.type === 'failure') {
									correctionResult = { error: result.data?.error as string };
								}
								await update({ reset: false });
							};
						}}>
							<button type="submit" class="announce-btn correction-btn" disabled={correctionSending}>
								{correctionSending ? 'Sending...' : 'Yes, Send Correction'}
							</button>
						</form>
						<button class="cancel-btn" onclick={() => correctionConfirming = false}>Cancel</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- RSVP Reminder Section -->
	{#if event.rsvpRequired}
		<div class="announcement-card rsvp-reminder-card">
			<div class="announcement-header">
				<h2>Send RSVP Reminder</h2>
			</div>

			{#if rsvpReminderResult?.success}
				<p class="announcement-success">RSVP reminder sent to {rsvpReminderResult.sentCount} member{rsvpReminderResult.sentCount !== 1 ? 's' : ''}.</p>
			{/if}

			{#if rsvpReminderResult?.error}
				<p class="announcement-error">{rsvpReminderResult.error}</p>
			{/if}

			<p class="announcement-info">
				Send an email to verified {clubLabel} members who have not yet RSVPd "going", reminding them that RSVP is required to attend.
			</p>

			{#if !rsvpReminderConfirming}
				<button
					class="announce-btn rsvp-reminder-btn"
					onclick={() => rsvpReminderConfirming = true}
				>
					Send RSVP Reminder
				</button>
			{:else}
				<div class="confirm-box">
					<p class="confirm-text">Send RSVP required reminder to all eligible members who have not yet RSVPd "going"?</p>
					<div class="confirm-actions">
						<form method="POST" action="?/sendRsvpReminder" use:enhance={() => {
							rsvpReminderSending = true;
							rsvpReminderResult = null;
							rsvpReminderConfirming = false;
							return async ({ result, update }) => {
								rsvpReminderSending = false;
								if (result.type === 'success') {
									rsvpReminderResult = { success: true, sentCount: result.data?.sentCount as number };
								} else if (result.type === 'failure') {
									rsvpReminderResult = { error: result.data?.error as string };
								}
								await update({ reset: false });
							};
						}}>
							<button type="submit" class="announce-btn rsvp-reminder-btn" disabled={rsvpReminderSending}>
								{rsvpReminderSending ? 'Sending...' : 'Yes, Send Reminder'}
							</button>
						</form>
						<button class="cancel-btn" onclick={() => rsvpReminderConfirming = false}>Cancel</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- RSVP List -->
	<div class="table-card">
		<div class="table-header">
			<h2>RSVPs ({rsvpList.length})</h2>
			<div class="table-actions">
				<select bind:value={statusFilter} class="filter-select">
					<option value="all">All statuses</option>
					<option value="going">Going</option>
					<option value="maybe">Maybe</option>
					<option value="not_going">Not Going</option>
				</select>
				<button class="export-btn" onclick={exportCsv}>Export CSV</button>
			</div>
		</div>

		{#if filteredList.length === 0}
			<p class="empty-state">No RSVPs{statusFilter !== 'all' ? ` with status "${statusFilter}"` : ''}.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th class="sortable" onclick={() => toggleSort('name')}>
							Name {sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
						</th>
						<th>Email</th>
						<th class="sortable" onclick={() => toggleSort('status')}>
							Status {sortBy === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
						</th>
						<th class="sortable" onclick={() => toggleSort('reliability')}>
							Reliability {sortBy === 'reliability' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
						</th>
						<th>Checked In</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredList as member}
						<tr>
							<td class="name-cell">{member.firstName} {member.lastName}</td>
							<td class="email-cell">{member.email}</td>
							<td>
								<span class="status-tag {member.status}">{member.status.replace('_', ' ')}</span>
							</td>
							<td>
								<span class="reliability-tag {reliabilityColor(member.reliabilityScore)}">
									{formatReliability(member.reliabilityScore)}
								</span>
							</td>
							<td>
								{#if member.checkedIn}
									<span class="checkin-yes">&#10003;</span>
								{:else}
									<span class="checkin-no">&mdash;</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	{#if checkinResponses.length > 0}
		<div class="table-card checkin-members-card">
			<div class="table-header">
				<h2>Checked In Members ({checkinResponses.length})</h2>
				<button class="export-btn" onclick={exportCheckinCsv}>Export CSV</button>
			</div>
			<table class="data-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Checked In At</th>
					</tr>
				</thead>
				<tbody>
					{#each [...checkinResponses].sort((a, b) => new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()) as row}
						<tr>
							<td class="name-cell">{row.firstName} {row.lastName}</td>
							<td class="email-cell">{row.email}</td>
							<td>{new Date(row.checkedInAt).toLocaleString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#if hasResponseData}
		<div class="responses-card">
			<div class="responses-header" onclick={() => showResponses = !showResponses}>
				<h2>Check-in Responses ({checkinResponses.filter(r => r.responses).length})</h2>
				<span class="toggle-text">{showResponses ? 'Hide' : 'Show'}</span>
			</div>

			{#if showResponses}
				<!-- Summary per question -->
				{#each checkinQuestions as q}
					<div class="response-summary">
						<p class="response-question">{q.question}</p>
						{#if q.type === 'text'}
							{@const textAnswers = checkinResponses
								.filter(r => r.responses && r.responses[q.id])
								.map(r => ({ name: `${r.firstName} ${r.lastName}`, answer: r.responses![q.id] as string }))}
							{#each textAnswers as entry}
								<div class="response-answer-row">
									<span class="response-answer">{entry.name}: {entry.answer}</span>
								</div>
							{/each}
						{:else}
							{@const answerCounts = (() => {
								const counts: Record<string, number> = {};
								for (const r of checkinResponses) {
									if (!r.responses || !r.responses[q.id]) continue;
									const val = r.responses[q.id];
									const answers = Array.isArray(val) ? val : [val];
									for (const a of answers) {
										counts[a] = (counts[a] || 0) + 1;
									}
								}
								return Object.entries(counts).sort((a, b) => b[1] - a[1]);
							})()}
							{#each answerCounts as [answer, count]}
								<div class="response-answer-row">
									<span class="response-answer">{answer}</span>
									<span class="response-count-badge">{count}</span>
								</div>
							{/each}
						{/if}
					</div>
				{/each}

				<!-- Detailed per-member table -->
				<table class="response-detail-table">
					<thead>
						<tr>
							<th>Member</th>
							{#each checkinQuestions as q}
								<th>{q.question}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each checkinResponses.filter(r => r.responses) as row}
							<tr>
								<td>{row.firstName} {row.lastName}</td>
								{#each checkinQuestions as q}
									<td>
										{#if row.responses && row.responses[q.id]}
											{#if Array.isArray(row.responses[q.id])}
												{(row.responses[q.id] as string[]).join(', ')}
											{:else}
												{row.responses[q.id]}
											{/if}
										{:else}
											<span class="checkin-no">&mdash;</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	{/if}
</div>

<style>
	.detail-page { max-width: 1100px; }

	.back-link {
		font-size: 0.8rem;
		color: #4f46e5;
		text-decoration: none;
		display: inline-block;
		margin-bottom: 0.75rem;
	}

	.back-link:hover { text-decoration: underline; }

	.header-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
	}

	.status-badge {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.status-badge.published { background: #dcfce7; color: #16a34a; }
	.status-badge.draft { background: #fef3c7; color: #d97706; }

	.header-badges {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.rsvp-required-badge {
		display: inline-block;
		padding: 0.15rem 0.6rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 600;
		background: rgba(239,68,68,0.12);
		color: #ef4444;
		border: 1px solid rgba(239,68,68,0.3);
	}

	.event-meta {
		font-size: 0.85rem;
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	/* Stats */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.stat-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.25rem;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
	}

	.stat-value.going { color: #16a34a; }
	.stat-value.maybe { color: #d97706; }
	.stat-value.checkedin { color: #4f46e5; }
	.stat-value.estimated { color: #7c3aed; }

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.25rem;
		display: block;
	}

	.historical-rate {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		color: #374151;
		margin-bottom: 1.5rem;
	}

	.historical-rate strong { color: #4f46e5; }

	/* Announcement */
	.announcement-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
	}

	.announcement-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.announcement-header h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
		margin: 0;
	}

	.sent-badge {
		display: inline-block;
		padding: 0.1rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 500;
		background: #dcfce7;
		color: #16a34a;
	}

	.announcement-info {
		font-size: 0.85rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
	}

	.announcement-info strong {
		color: #374151;
	}

	.excluded-info {
		color: #9ca3af;
		font-size: 0.8rem;
	}

	.announcement-success {
		font-size: 0.85rem;
		color: #16a34a;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.announcement-error {
		font-size: 0.85rem;
		color: #dc2626;
		background: #fef2f2;
		border: 1px solid #fecaca;
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.announce-btn {
		padding: 0.45rem 1rem;
		background: #7c3aed;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
	}

	.announce-btn:hover { background: #6d28d9; }
	.announce-btn:disabled { opacity: 0.6; cursor: not-allowed; }

	.correction-card { border-color: #fde68a; }
	.correction-btn { background: #d97706; }
	.correction-btn:hover { background: #b45309; }

	.rsvp-reminder-card { border-color: rgba(239,68,68,0.3); }
	.rsvp-reminder-btn { background: #dc2626; }
	.rsvp-reminder-btn:hover { background: #b91c1c; }

	.confirm-box {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
	}

	.confirm-text {
		font-size: 0.85rem;
		color: #374151;
		margin: 0 0 0.75rem;
	}

	.confirm-text strong {
		color: #111827;
	}

	.confirm-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.cancel-btn {
		padding: 0.45rem 1rem;
		background: #fff;
		color: #6b7280;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
	}

	.cancel-btn:hover {
		background: #f3f4f6;
		color: #374151;
	}

	/* Emailed members */
	.emailed-card {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-left: 4px solid #10b981;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.emailed-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid #bbf7d0;
		flex-wrap: wrap;
	}

	.emailed-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.emailed-title h2 {
		font-size: 1.05rem;
		font-weight: 600;
		color: #14532d;
		margin: 0;
	}

	.sent-dot {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 9999px;
		background: #10b981;
		box-shadow: 0 0 0 3px #dcfce7;
	}

	.emailed-subtitle {
		font-size: 0.75rem;
		color: #166534;
	}

	.emailed-scroll {
		max-height: 20rem;
		overflow-y: auto;
		background: #fff;
	}

	.emailed-empty {
		margin: 0;
		padding: 0.85rem 1rem;
		font-size: 0.85rem;
		color: #6b7280;
		background: #fff;
	}

	/* Table */
	.table-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.table-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1rem 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.table-header h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
	}

	.table-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.filter-select {
		padding: 0.35rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		color: #374151;
		background: #fff;
	}

	.export-btn {
		padding: 0.35rem 0.75rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
	}

	.export-btn:hover { background: #4338ca; }

	.empty-state {
		padding: 2rem;
		text-align: center;
		color: #9ca3af;
		font-size: 0.9rem;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th {
		background: #f9fafb;
		padding: 0.65rem 1rem;
		text-align: left;
		font-size: 0.75rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #e5e7eb;
	}

	.data-table th.sortable {
		cursor: pointer;
		user-select: none;
	}

	.data-table th.sortable:hover { color: #4f46e5; }

	.data-table td {
		padding: 0.65rem 1rem;
		font-size: 0.85rem;
		color: #374151;
		border-bottom: 1px solid #f3f4f6;
	}

	.name-cell { font-weight: 500; }
	.email-cell { color: #6b7280; }

	/* Status tags */
	.status-tag {
		display: inline-block;
		padding: 0.1rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-tag.going { background: #dcfce7; color: #16a34a; }
	.status-tag.maybe { background: #fef3c7; color: #d97706; }
	.status-tag.not_going { background: #fee2e2; color: #dc2626; }

	/* Reliability tags */
	.reliability-tag {
		display: inline-block;
		padding: 0.1rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 600;
	}

	.reliability-high { background: #dcfce7; color: #16a34a; }
	.reliability-mid { background: #fef3c7; color: #d97706; }
	.reliability-low { background: #fee2e2; color: #dc2626; }
	.reliability-new { background: #f3f4f6; color: #9ca3af; }

	.turnout-breakdown {
		display: inline-flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
		margin-top: 0.35rem;
	}

	.tier-pip {
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		letter-spacing: 0.01em;
	}

	.tier-pip.high { background: #dcfce7; color: #15803d; }
	.tier-pip.mid { background: #fef3c7; color: #b45309; }
	.tier-pip.excluded { background: #fee2e2; color: #b91c1c; }

	.checkin-yes { color: #16a34a; font-weight: 600; }
	.checkin-no { color: #d1d5db; }

	.checkin-members-card { margin-top: 1.5rem; }

	/* Responses Section */
	.responses-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
		margin-top: 1.5rem;
	}

	.responses-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
		cursor: pointer;
	}

	.responses-header:hover { background: #f9fafb; }

	.responses-header h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
		margin: 0;
	}

	.toggle-text {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.response-summary {
		padding: 1rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.response-question {
		font-size: 0.85rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.response-answer-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.2rem 0;
	}

	.response-answer {
		font-size: 0.8rem;
		color: #6b7280;
	}

	.response-count-badge {
		font-size: 0.7rem;
		font-weight: 600;
		color: #4f46e5;
		background: #eef2ff;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
	}

	.response-detail-table {
		width: 100%;
		border-collapse: collapse;
	}

	.response-detail-table th {
		background: #f9fafb;
		padding: 0.5rem 0.75rem;
		text-align: left;
		font-size: 0.7rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #e5e7eb;
	}

	.response-detail-table td {
		padding: 0.5rem 0.75rem;
		font-size: 0.8rem;
		color: #374151;
		border-bottom: 1px solid #f3f4f6;
	}

	@media (max-width: 768px) {
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
		.table-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
	}
</style>
