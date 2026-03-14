<script lang="ts">
	import { enhance } from '$app/forms';
	import type { RsvpMemberDetail, EventStats } from '$lib/server/db/queries';

	interface Props {
		event: {
			id: string;
			title: string;
			date: string;
			time: string | null;
			location: string | null;
			description: string | null;
			isPublished: boolean | null;
		};
		rsvpList: RsvpMemberDetail[];
		stats: EventStats;
		historicalRate: number | null;
		clubType: 'astronomy' | 'physics';
		backHref: string;
		announcementRecipientCount: number;
		announcementAlreadySent: boolean;
	}

	let { event, rsvpList, stats, historicalRate, clubType, backHref, announcementRecipientCount, announcementAlreadySent }: Props = $props();

	let announcementSending = $state(false);
	let announcementResult = $state<{ success?: boolean; sentCount?: number; error?: string } | null>(null);

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
			<span class="status-badge" class:published={event.isPublished} class:draft={!event.isPublished}>
				{event.isPublished ? 'Published' : 'Draft'}
			</span>
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
			<span class="stat-value estimated">~{stats.estimatedTurnout}</span>
			<span class="stat-label">Est. Turnout</span>
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
			{/if}
		</p>

		{#if announcementRecipientCount > 0}
			<form method="POST" action="?/sendAnnouncement" use:enhance={() => {
				announcementSending = true;
				announcementResult = null;
				return async ({ result, update }) => {
					announcementSending = false;
					if (result.type === 'success') {
						announcementResult = { success: true, sentCount: result.data?.sentCount };
					} else if (result.type === 'failure') {
						announcementResult = { error: result.data?.error as string };
					}
					await update({ reset: false });
				};
			}}>
				<button
					type="submit"
					class="announce-btn"
					disabled={announcementSending}
					onclick={(e) => {
						if (!confirm(`Send announcement email to ${announcementRecipientCount} members?`)) e.preventDefault();
					}}
				>
					{#if announcementSending}
						Sending...
					{:else}
						{announcementAlreadySent ? 'Send to New Members' : 'Send Announcement'}
					{/if}
				</button>
			</form>
		{/if}
	</div>

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

	.checkin-yes { color: #16a34a; font-weight: 600; }
	.checkin-no { color: #d1d5db; }

	@media (max-width: 768px) {
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
		.table-header { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
	}
</style>
