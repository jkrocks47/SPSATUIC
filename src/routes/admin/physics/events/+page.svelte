<script lang="ts">
	import { enhance } from '$app/forms';
	import CheckinQuestionBuilder from '$lib/components/admin/CheckinQuestionBuilder.svelte';
	import type { CheckinQuestion } from '$lib/server/db/schema';

	let { data, form } = $props();

	let showForm = $state(false);
	let editingId = $state<string | null>(null);
	let showQrId = $state<string | null>(null);
	let showRsvpQrId = $state<string | null>(null);
	let showInterests = $state(false);
	let createQuestions = $state<CheckinQuestion[]>([]);
	let editQuestions = $state<CheckinQuestion[]>([]);

	let interestData = $derived(data.interestData ?? []);
	let topInterest = $derived(interestData.length > 0 && interestData[0].count > 0 ? interestData[0] : null);
	let maxInterestCount = $derived(interestData.length > 0 ? interestData[0].count : 1);
</script>

<svelte:head>
	<title>Physics Events - UICSpacetime Admin</title>
</svelte:head>

<div class="events-page">
	{#if data.historicalRate !== null}
		<div class="historical-rate">
			Historical turnout rate for Physics events: <strong>{data.historicalRate}%</strong> of "going" RSVPs
		</div>
	{/if}

	{#if interestData.length > 0}
		<div class="interest-panel">
			<button class="interest-toggle" onclick={() => showInterests = !showInterests}>
				<span class="interest-toggle-label">
					{#if topInterest}
						Suggested: <strong>{topInterest.preference}</strong> event ({topInterest.count} of {data.activeMemberCount} active members)
					{:else}
						Member Interests
					{/if}
				</span>
				<span class="toggle-icon">{showInterests ? '−' : '+'}</span>
			</button>

			{#if showInterests}
				<div class="interest-details">
					<p class="interest-source">Based on {data.activeMemberCount} active member{data.activeMemberCount !== 1 ? 's' : ''} (verified, active in last 6 months)</p>
					<div class="interest-bars">
						{#each interestData as interest}
							<div class="interest-row">
								<span class="interest-name">{interest.preference}</span>
								<div class="bar-track">
									<div class="bar-fill" style="width: {maxInterestCount > 0 ? (interest.count / maxInterestCount) * 100 : 0}%"></div>
								</div>
								<span class="interest-count">{interest.count}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="page-header">
		<h1 class="page-title">Physics Events</h1>
		<button class="add-btn" onclick={() => { showForm = !showForm; editingId = null; }}>
			{showForm ? 'Cancel' : '+ Add Event'}
		</button>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">Event saved successfully.</div>
	{/if}

	{#if showForm}
		<div class="form-card">
			<h2>New Event</h2>
			<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showForm = false;
				};
			}}>
				<div class="form-grid">
					<div class="form-group full-width">
						<label for="title">Title *</label>
						<input type="text" id="title" name="title" required />
					</div>
					<div class="form-group full-width">
						<label for="description">Description</label>
						<textarea id="description" name="description" rows="4"></textarea>
						<p class="field-hint">Supports markdown links: <code>[Link text](https://example.com)</code></p>
					</div>
					<div class="form-group">
						<label for="date">Date *</label>
						<input type="date" id="date" name="date" required />
					</div>
					<div class="form-group">
						<label for="time">Time</label>
						<input type="text" id="time" name="time" placeholder="e.g. 7:00 PM" />
					</div>
					<div class="form-group">
						<label for="location">Location</label>
						<input type="text" id="location" name="location" />
					</div>
					<div class="form-group">
						<label for="locationUrl">Location URL</label>
						<input type="url" id="locationUrl" name="locationUrl" placeholder="Google Maps link" />
					</div>
					<div class="form-group">
						<label for="maxAttendees">Max Attendees</label>
						<input type="number" id="maxAttendees" name="maxAttendees" min="1" />
					</div>
					<div class="form-group">
						<label for="image">Image</label>
						<input type="file" id="image" name="image" accept="image/*" />
					</div>
					<div class="form-group checkbox-group">
						<label><input type="checkbox" name="isPublished" checked /> Published</label>
					</div>
				</div>
				<div class="full-width">
					<CheckinQuestionBuilder bind:questions={createQuestions} />
				</div>

				<div class="form-actions">
					<button type="submit" class="submit-btn">Create Event</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="table-card">
		{#if data.events.length === 0}
			<p class="empty-state">No events yet. Create your first event above.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Date</th>
						<th>RSVPs</th>
						<th>Est. Turnout</th>
						<th>Attended</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.events as event}
						<tr>
							<td class="title-cell">
								<a href="/admin/physics/events/{event.id}" class="event-link">{event.title}</a>
							</td>
							<td>{event.date}</td>
							<td class="rsvp-cell">
								{#if event.rsvpCounts.going > 0}
									<span class="mini-badge going">{event.rsvpCounts.going} going</span>
								{/if}
								{#if event.rsvpCounts.maybe > 0}
									<span class="mini-badge maybe">{event.rsvpCounts.maybe} maybe</span>
								{/if}
								{#if event.rsvpCounts.going === 0 && event.rsvpCounts.maybe === 0}
									<span class="no-data">--</span>
								{/if}
							</td>
							<td class="turnout-cell">
								{#if event.turnout.estimated > 0 || event.turnout.highCount + event.turnout.midCount + event.turnout.excludedCount > 0}
									<div class="turnout-stack">
										<span class="mini-badge turnout">~{event.turnout.estimated}</span>
										<span class="turnout-breakdown" title="High: ≥75% reliability; Mid: 50–75%; Excluded: &lt;50%, not counted">
											{#if event.turnout.highCount > 0}<span class="tier-pip high">{event.turnout.highCount}H</span>{/if}
											{#if event.turnout.midCount > 0}<span class="tier-pip mid">{event.turnout.midCount}M</span>{/if}
											{#if event.turnout.excludedCount > 0}<span class="tier-pip excluded">{event.turnout.excludedCount}×</span>{/if}
										</span>
									</div>
								{:else}
									<span class="no-data">--</span>
								{/if}
							</td>
							<td>{event.attendanceCount || '--'}</td>
							<td>
								<form method="POST" action="?/togglePublish" use:enhance class="inline-form">
									<input type="hidden" name="id" value={event.id} />
									<button type="submit" class="badge-btn" class:published={event.isPublished} class:draft={!event.isPublished}>
										{event.isPublished ? 'Published' : 'Draft'}
									</button>
								</form>
							</td>
							<td class="actions-cell">
								<button class="action-btn-sm" onclick={() => { if (editingId === event.id) { editingId = null; } else { editingId = event.id; editQuestions = event.checkinQuestions ? [...event.checkinQuestions] : []; } }}>Edit</button>
								{#if event.checkinCode}
									<button class="action-btn-sm qr" onclick={() => { showQrId = showQrId === event.id ? null : event.id; if (showQrId) showRsvpQrId = null; }}>Check In</button>
								{/if}
								<button class="action-btn-sm rsvp" onclick={() => { showRsvpQrId = showRsvpQrId === event.id ? null : event.id; if (showRsvpQrId) showQrId = null; }}>RSVP</button>
								<a href="/admin/poster/{event.id}" target="_blank" class="action-btn-sm poster">Poster</a>
								<form method="POST" action="?/delete" use:enhance class="inline-form">
									<input type="hidden" name="id" value={event.id} />
									<button type="submit" class="delete-btn" onclick={(e) => {
										if (!confirm('Delete this event?')) e.preventDefault();
									}}>Delete</button>
								</form>
							</td>
						</tr>

						{#if showQrId === event.id && event.checkinCode}
							<tr>
								<td colspan="7" class="qr-row">
									<div class="qr-info">
										<p class="qr-label">Check-In QR Code <span class="qr-only-badge">Check-In Only</span></p>
										<p class="qr-hint">This QR code is <strong>for check-in only</strong> — members scan it at the event to record attendance. Scans before the event starts will be redirected to RSVP.</p>
										<code class="qr-url">/checkin/{event.id}?code={event.checkinCode}</code>
										<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/checkin/${event.id}?code=${event.checkinCode}`)}" alt="QR Code" class="qr-image" />
									</div>
								</td>
							</tr>
						{/if}

						{#if showRsvpQrId === event.id}
							<tr>
								<td colspan="7" class="qr-row">
									<div class="qr-info">
										<p class="qr-label">RSVP QR Code <span class="qr-only-badge rsvp-badge">RSVP</span></p>
										<p class="qr-hint">This QR code links to the public event page where members can RSVP.</p>
										<code class="qr-url">/event/{event.id}</code>
										<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event.id}`)}" alt="RSVP QR Code" class="qr-image" />
									</div>
								</td>
							</tr>
						{/if}

						{#if editingId === event.id}
							<tr>
								<td colspan="7" class="edit-row">
									<form method="POST" action="?/edit" enctype="multipart/form-data" use:enhance={() => {
										return async ({ update }) => { await update(); editingId = null; };
									}}>
										<input type="hidden" name="id" value={event.id} />
										<div class="form-grid">
											<div class="form-group full-width"><label>Title *</label><input type="text" name="title" required value={event.title} /></div>
											<div class="form-group full-width"><label>Description</label><textarea name="description" rows="3">{event.description || ''}</textarea><p class="field-hint">Supports markdown links: <code>[Link text](https://example.com)</code></p></div>
											<div class="form-group"><label>Date *</label><input type="date" name="date" required value={event.date} /></div>
											<div class="form-group"><label>Time</label><input type="text" name="time" value={event.time || ''} /></div>
											<div class="form-group"><label>Location</label><input type="text" name="location" value={event.location || ''} /></div>
											<div class="form-group"><label>Location URL</label><input type="url" name="locationUrl" value={event.locationUrl || ''} /></div>
											<div class="form-group"><label>Max Attendees</label><input type="number" name="maxAttendees" min="1" value={event.maxAttendees || ''} /></div>
											<div class="form-group full-width image-edit-group">
												<label>{event.imageUrl ? 'Replace Image' : 'Add Image'}</label>
												{#if event.imageUrl}
													<div class="current-image">
														<img src={event.imageUrl} alt="Current event image" />
														<label class="remove-image-label">
															<input type="checkbox" name="removeImage" />
															Remove image
														</label>
													</div>
												{/if}
												<input type="file" name="image" accept="image/*" />
												<p class="field-hint">Upload a new image to {event.imageUrl ? 'replace the current one' : 'attach to this event'}.</p>
											</div>
											<div class="form-group checkbox-group"><label><input type="checkbox" name="isPublished" checked={event.isPublished} /> Published</label></div>
										<div class="form-group checkbox-group"><label><input type="checkbox" name="rsvpRequired" checked={event.rsvpRequired} /> RSVP Required</label></div>
										</div>
										<div class="full-width">
											<CheckinQuestionBuilder bind:questions={editQuestions} />
										</div>

										<div class="form-actions">
											<button type="submit" class="submit-btn">Save Changes</button>
											<button type="button" class="cancel-btn" onclick={() => editingId = null}>Cancel</button>
										</div>
									</form>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<style>
	.events-page { max-width: 1200px; }

	.historical-rate {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		color: #374151;
		margin-bottom: 1.25rem;
	}

	.historical-rate strong { color: #4f46e5; }
	.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.page-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #191923; }
	.add-btn { padding: 0.5rem 1rem; background: #4f46e5; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.825rem; font-weight: 500; cursor: pointer; }
	.add-btn:hover { background: #4338ca; }
	.error-message { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }
	.success-message { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }
	.form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; }
	.form-card h2 { font-size: 1.1rem; font-weight: 600; color: #374151; margin-bottom: 1rem; }
	.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.full-width { grid-column: 1 / -1; }
	.form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.3rem; }
	.field-hint { margin: 0.3rem 0 0; font-size: 0.75rem; color: #6b7280; }
	.field-hint code { font-family: monospace; background: #f3f4f6; padding: 0.1em 0.3em; border-radius: 3px; }
	.form-group input[type='text'], .form-group input[type='date'], .form-group input[type='url'], .form-group input[type='number'], .form-group input[type='file'], .form-group textarea { width: 100%; padding: 0.5rem 0.65rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.85rem; color: #374151; }
	.form-group textarea { resize: vertical; }
	.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
	.checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
	.form-actions { margin-top: 1rem; display: flex; gap: 0.5rem; }
	.submit-btn { padding: 0.5rem 1.25rem; background: #4f46e5; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.825rem; font-weight: 500; cursor: pointer; }
	.submit-btn:hover { background: #4338ca; }
	.cancel-btn { padding: 0.5rem 1.25rem; background: transparent; border: 1px solid #d1d5db; color: #6b7280; border-radius: 0.375rem; font-size: 0.825rem; cursor: pointer; }
	.table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
	.empty-state { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.9rem; }
	.data-table { width: 100%; border-collapse: collapse; }
	.data-table th { background: #f9fafb; padding: 0.65rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
	.data-table td { padding: 0.75rem 1rem; font-size: 0.85rem; color: #374151; border-bottom: 1px solid #f3f4f6; }
	.title-cell { font-weight: 500; }
	.event-link { color: #4f46e5; text-decoration: none; }
	.event-link:hover { text-decoration: underline; }
	.rsvp-cell { display: flex; gap: 0.35rem; flex-wrap: wrap; }
	.mini-badge { display: inline-block; padding: 0.1rem 0.4rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 500; }
	.mini-badge.going { background: #dcfce7; color: #16a34a; }
	.mini-badge.maybe { background: #fef3c7; color: #d97706; }
	.mini-badge.turnout { background: #ede9fe; color: #7c3aed; }
	.turnout-stack { display: flex; flex-direction: column; align-items: flex-start; gap: 0.2rem; }
	.turnout-breakdown { display: inline-flex; gap: 0.25rem; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.02em; }
	.tier-pip { padding: 0.05rem 0.3rem; border-radius: 9999px; line-height: 1; }
	.tier-pip.high { background: #dcfce7; color: #15803d; }
	.tier-pip.mid { background: #fef3c7; color: #b45309; }
	.tier-pip.excluded { background: #fee2e2; color: #b91c1c; }
	.no-data { color: #d1d5db; }
	.badge-btn { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 9999px; font-size: 0.7rem; font-weight: 500; cursor: pointer; border: none; }
	.badge-btn:hover { opacity: 0.8; }
	.badge-btn.published { background: #dcfce7; color: #16a34a; }
	.badge-btn.draft { background: #fef3c7; color: #d97706; }
	.actions-cell { display: flex; gap: 0.35rem; align-items: center; }
	.action-btn-sm { background: none; border: 1px solid #d1d5db; color: #374151; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; }
	.action-btn-sm:hover { background: #f3f4f6; }
	.action-btn-sm.qr { border-color: #c4b5fd; color: #7c3aed; }
	.action-btn-sm.qr:hover { background: #f5f3ff; }
	.action-btn-sm.rsvp { border-color: #86efac; color: #15803d; }
	.action-btn-sm.rsvp:hover { background: #f0fdf4; }

	.action-btn-sm.poster {
		border-color: #93c5fd;
		color: #2563eb;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.action-btn-sm.poster:hover { background: #eff6ff; }

	.inline-form { display: inline; }
	.delete-btn { background: none; border: 1px solid #fecaca; color: #dc2626; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; }
	.delete-btn:hover { background: #fef2f2; }
	.edit-row, .qr-row { background: #f9fafb; padding: 1.25rem !important; }
	.qr-info { text-align: center; }
	.qr-label { font-size: 0.75rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem; }
	.qr-only-badge { font-size: 0.65rem; font-weight: 700; padding: 0.1rem 0.45rem; border-radius: 9999px; background: #dcfce7; color: #15803d; letter-spacing: 0.02em; text-transform: uppercase; }
	.qr-only-badge.rsvp-badge { background: #ede9fe; color: #6d28d9; }
	.qr-url { display: block; font-size: 0.7rem; color: #6b7280; background: #fff; padding: 0.4rem 0.75rem; border-radius: 0.25rem; border: 1px solid #e5e7eb; margin-bottom: 0.5rem; word-break: break-all; }
	.qr-hint { font-size: 0.7rem; color: #9ca3af; margin-bottom: 0.75rem; }
	.qr-image { width: 200px; height: 200px; border-radius: 0.5rem; }
	.image-edit-group .current-image { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.image-edit-group .current-image img { width: 96px; height: 96px; object-fit: cover; border-radius: 0.375rem; border: 1px solid #e5e7eb; }
	.remove-image-label { display: flex !important; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #dc2626; font-weight: 500; cursor: pointer; margin: 0 !important; }
	/* Interest Panel */
	.interest-panel {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		margin-bottom: 1.25rem;
		overflow: hidden;
	}

	.interest-toggle {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.85rem;
		color: #374151;
		text-align: left;
	}

	.interest-toggle:hover { background: #f9fafb; }
	.interest-toggle-label strong { color: #4f46e5; }
	.toggle-icon { font-size: 1rem; color: #9ca3af; font-weight: 600; }

	.interest-details {
		padding: 0 1rem 1rem;
		border-top: 1px solid #f3f4f6;
	}

	.interest-source {
		font-size: 0.75rem;
		color: #9ca3af;
		padding-top: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.interest-bars {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.75rem;
	}

	.interest-row {
		display: grid;
		grid-template-columns: 120px 1fr 35px;
		align-items: center;
		gap: 0.75rem;
	}

	.interest-name { font-size: 0.8rem; color: #374151; font-weight: 500; }

	.bar-track {
		height: 0.4rem;
		background: #f3f4f6;
		border-radius: 9999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: #4f46e5;
		border-radius: 9999px;
		transition: width 0.3s ease;
		min-width: 2px;
	}

	.interest-count { font-size: 0.75rem; font-weight: 600; color: #4f46e5; text-align: right; }

	@media (max-width: 640px) {
		.form-grid { grid-template-columns: 1fr; }
		.interest-row { grid-template-columns: 90px 1fr 30px; }
	}
</style>
