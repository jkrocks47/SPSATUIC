<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const member = $derived(data.member);
	let showDeleteConfirm = $state(false);
</script>

<svelte:head>
	<title>{member.firstName} {member.lastName} - Members - Admin</title>
</svelte:head>

<div class="member-detail">
	<a href="/admin/members" class="back-link">&larr; All Members</a>

	{#if form?.success}
		<div class="success-message">Member updated.</div>
	{/if}

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<!-- Profile card -->
	<div class="card profile-card">
		<div class="profile-header">
			<div>
				<h1 class="member-name">{member.firstName} {member.lastName}</h1>
				<p class="member-email">{member.email}</p>
			</div>
			<div class="profile-badges">
				{#if member.astronomyMember}<span class="club-badge astro">Astronomy</span>{/if}
				{#if member.physicsMember}<span class="club-badge phys">Physics</span>{/if}
				<span class="verify-badge" class:verified={member.emailVerified} class:unverified={!member.emailVerified}>
					{member.emailVerified ? 'Verified' : 'Unverified'}
				</span>
			</div>
		</div>

		<div class="profile-grid">
			<div><span class="label">Year</span><span class="value">{member.year || '--'}</span></div>
			<div><span class="label">Major</span><span class="value">{member.major || '--'}</span></div>
			<div><span class="label">Joined</span><span class="value">{member.createdAt?.toISOString().split('T')[0] || '--'}</span></div>
			<div>
				<span class="label">Role</span>
				<form method="POST" action="?/updateRole" use:enhance class="inline-form">
					<select name="role" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="role-select">
						<option value="member" selected={member.role === 'member'}>Member</option>
						<option value="board" selected={member.role === 'board'}>Board</option>
					</select>
				</form>
			</div>
			<div>
				<span class="label">Admin Role</span>
				{#if data.currentUserRole === 'super_admin'}
					<form method="POST" action="?/updateAdminRole" use:enhance class="inline-form">
						<select name="adminRole" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="role-select">
							<option value="" selected={!member.adminRole}>None</option>
							<option value="super_admin" selected={member.adminRole === 'super_admin'}>Super Admin</option>
							<option value="astronomy_admin" selected={member.adminRole === 'astronomy_admin'}>Astronomy Admin</option>
							<option value="physics_admin" selected={member.adminRole === 'physics_admin'}>Physics Admin</option>
						</select>
					</form>
				{:else if member.adminRole}
					<span class="admin-badge">{member.adminRole.replace('_', ' ')}</span>
				{:else}
					<span class="value">--</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Events Attended -->
	<div class="card">
		<h2 class="card-title">Events Attended ({data.attended.length})</h2>
		{#if data.attended.length === 0}
			<p class="empty">No events attended.</p>
		{:else}
			<table class="mini-table">
				<thead><tr><th>Event</th><th>Date</th><th>Club</th></tr></thead>
				<tbody>
					{#each data.attended as event}
						<tr>
							<td><a href="/admin/{event.clubType}/events/{event.eventId}" class="event-link">{event.title}</a></td>
							<td>{event.date}</td>
							<td><span class="club-mini" class:astro={event.clubType === 'astronomy'} class:phys={event.clubType === 'physics'}>{event.clubType}</span></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- RSVPs -->
	<div class="card">
		<h2 class="card-title">RSVPs ({data.rsvps.length})</h2>
		{#if data.rsvps.length === 0}
			<p class="empty">No RSVPs.</p>
		{:else}
			<table class="mini-table">
				<thead><tr><th>Event</th><th>Date</th><th>Status</th></tr></thead>
				<tbody>
					{#each data.rsvps as rsvp}
						<tr>
							<td><a href="/admin/{rsvp.clubType}/events/{rsvp.eventId}" class="event-link">{rsvp.title}</a></td>
							<td>{rsvp.date}</td>
							<td>
								<span class="rsvp-badge" class:going={rsvp.status === 'going'} class:maybe={rsvp.status === 'maybe'} class:not-going={rsvp.status === 'not_going'}>
									{rsvp.status.replace('_', ' ')}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Delete Member -->
	{#if data.currentUserRole === 'super_admin'}
		<div class="card danger-card">
			<h2 class="card-title danger-title">Danger Zone</h2>
			{#if !showDeleteConfirm}
				<p class="danger-text">Permanently delete this member and all their associated data (sessions, RSVPs, check-ins, etc.).</p>
				<button class="btn-danger" onclick={() => showDeleteConfirm = true}>Delete Member</button>
			{:else}
				<p class="danger-text">Are you sure you want to delete <strong>{member.firstName} {member.lastName}</strong>? This action cannot be undone.</p>
				<div class="danger-actions">
					<form method="POST" action="?/deleteMember" use:enhance>
						<button type="submit" class="btn-danger-confirm">Yes, Delete</button>
					</form>
					<button class="btn-cancel" onclick={() => showDeleteConfirm = false}>Cancel</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.member-detail { max-width: 800px; }

	.back-link { font-size: 0.8rem; color: #4f46e5; text-decoration: none; display: inline-block; margin-bottom: 1rem; }
	.back-link:hover { text-decoration: underline; }

	.success-message { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }

	.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.25rem; margin-bottom: 1rem; }

	.profile-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem; }
	.member-name { font-family: 'Space Grotesk', sans-serif; font-size: 1.35rem; font-weight: 700; color: #191923; }
	.member-email { font-size: 0.85rem; color: #6b7280; }

	.profile-badges { display: flex; gap: 0.35rem; flex-wrap: wrap; }
	.club-badge { font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.club-badge.astro { background: #eef2ff; color: #4f46e5; }
	.club-badge.phys { background: #e0f2fe; color: #0e79b2; }
	.verify-badge { font-size: 0.65rem; font-weight: 500; padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.verify-badge.verified { background: #dcfce7; color: #16a34a; }
	.verify-badge.unverified { background: #fef3c7; color: #d97706; }

	.profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
	.label { display: block; font-size: 0.7rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
	.value { font-size: 0.9rem; color: #374151; }

	.inline-form { display: inline; }
	.role-select { padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem; font-size: 0.8rem; }

	.card-title { font-family: 'Space Grotesk', sans-serif; font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem; }
	.empty { font-size: 0.85rem; color: #9ca3af; }

	.mini-table { width: 100%; border-collapse: collapse; }
	.mini-table th { font-size: 0.7rem; font-weight: 600; color: #6b7280; text-transform: uppercase; text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e7eb; }
	.mini-table td { font-size: 0.825rem; color: #374151; padding: 0.5rem 0.75rem; border-bottom: 1px solid #f3f4f6; }

	.event-link { color: #4f46e5; text-decoration: none; }
	.event-link:hover { text-decoration: underline; }

	.club-mini { font-size: 0.6rem; font-weight: 600; padding: 0.1rem 0.35rem; border-radius: 9999px; text-transform: capitalize; }
	.club-mini.astro { background: #eef2ff; color: #4f46e5; }
	.club-mini.phys { background: #e0f2fe; color: #0e79b2; }

	.rsvp-badge { font-size: 0.65rem; font-weight: 500; padding: 0.1rem 0.4rem; border-radius: 9999px; text-transform: capitalize; }
	.rsvp-badge.going { background: #dcfce7; color: #16a34a; }
	.rsvp-badge.maybe { background: #fef3c7; color: #d97706; }
	.rsvp-badge.not-going { background: #fef2f2; color: #dc2626; }

	.admin-badge { font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 9999px; background: #fef3c7; color: #d97706; text-transform: capitalize; }

	.error-message { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }

	.danger-card { border-color: #fecaca; }
	.danger-title { color: #dc2626; }
	.danger-text { font-size: 0.85rem; color: #6b7280; margin-bottom: 0.75rem; }
	.btn-danger { padding: 0.4rem 1rem; background: #fff; color: #dc2626; border: 1px solid #dc2626; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
	.btn-danger:hover { background: #fef2f2; }
	.danger-actions { display: flex; gap: 0.5rem; }
	.btn-danger-confirm { padding: 0.4rem 1rem; background: #dc2626; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
	.btn-danger-confirm:hover { background: #b91c1c; }
	.btn-cancel { padding: 0.4rem 1rem; background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; }
	.btn-cancel:hover { background: #e5e7eb; }
</style>
