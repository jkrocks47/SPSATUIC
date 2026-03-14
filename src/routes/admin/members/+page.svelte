<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { EVENT_PREFERENCES } from '$lib/utils/constants';

	let { data, form } = $props();

	let search = $state(data.search);

	function handleSearch() {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (data.clubFilter) params.set('club', data.clubFilter);
		if (data.roleFilter) params.set('role', data.roleFilter);
		if (data.interestFilter) params.set('interest', data.interestFilter);
		goto(`/admin/members?${params.toString()}`);
	}

	function handleExport() {
		if (form?.csv) {
			const blob = new Blob([form.csv], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'members.csv';
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	$effect(() => {
		if (form?.csv) handleExport();
	});
</script>

<svelte:head>
	<title>Members - UICSpacetime Admin</title>
</svelte:head>

<div class="members-page">
	<div class="page-header">
		<h1 class="page-title">Members ({data.totalCount})</h1>
		<form method="POST" action="?/exportCsv" use:enhance>
			<button type="submit" class="export-btn">Export CSV</button>
		</form>
	</div>

	{#if form?.success}
		<div class="success-message">Member updated.</div>
	{/if}

	<!-- Filters -->
	<div class="filters">
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="search-form">
			<input type="text" placeholder="Search by name or email..." bind:value={search} class="search-input" />
			<button type="submit" class="search-btn">Search</button>
		</form>
		<div class="filter-row">
			<div class="filter-chips">
				<a href="/admin/members" class="chip" class:active={!data.clubFilter && !data.roleFilter && !data.interestFilter}>All</a>
				<a href="/admin/members?club=astronomy" class="chip" class:active={data.clubFilter === 'astronomy'}>Astronomy</a>
				<a href="/admin/members?club=physics" class="chip" class:active={data.clubFilter === 'physics'}>Physics</a>
				<a href="/admin/members?role=board" class="chip" class:active={data.roleFilter === 'board'}>Board</a>
			</div>
			<select
				value={data.interestFilter}
				onchange={(e) => {
					const params = new URLSearchParams();
					if (search) params.set('search', search);
					if (data.clubFilter) params.set('club', data.clubFilter);
					if (data.roleFilter) params.set('role', data.roleFilter);
					const val = e.currentTarget.value;
					if (val) params.set('interest', val);
					goto(`/admin/members?${params.toString()}`);
				}}
				class="interest-select"
			>
				<option value="">All Interests</option>
				{#each EVENT_PREFERENCES as pref}
					<option value={pref}>{pref}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Table -->
	<div class="table-card">
		{#if data.members.length === 0}
			<p class="empty-state">No members found.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Clubs</th>
						<th>Events</th>
						<th>Interests</th>
						<th>Role</th>
						<th>Verified</th>
						<th>Joined</th>
					</tr>
				</thead>
				<tbody>
					{#each data.members as member}
						<tr>
							<td class="name-cell">
								<a href="/admin/members/{member.id}" class="member-link">{member.firstName} {member.lastName}</a>
							</td>
							<td class="email-cell">{member.email}</td>
							<td>
								{#if member.astronomyMember}<span class="club-badge astro">Astro</span>{/if}
								{#if member.physicsMember}<span class="club-badge phys">Physics</span>{/if}
							</td>
							<td>{member.eventsAttended}</td>
							<td class="interests-cell">
								{#if member.eventPreferences && member.eventPreferences.length > 0}
									{#each member.eventPreferences.slice(0, 3) as pref}
										<span class="interest-badge">{pref}</span>
									{/each}
									{#if member.eventPreferences.length > 3}
										<span class="interest-more">+{member.eventPreferences.length - 3}</span>
									{/if}
								{:else}
									<span class="no-prefs">--</span>
								{/if}
							</td>
							<td>
								<form method="POST" action="?/updateRole" use:enhance class="inline-form">
									<input type="hidden" name="id" value={member.id} />
									<select name="role" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="role-select">
										<option value="member" selected={member.role === 'member'}>Member</option>
										<option value="board" selected={member.role === 'board'}>Board</option>
									</select>
								</form>
							</td>
							<td>
								<span class="verify-badge" class:verified={member.emailVerified} class:unverified={!member.emailVerified}>
									{member.emailVerified ? 'Yes' : 'No'}
								</span>
							</td>
							<td class="date-cell">{member.createdAt?.toISOString().split('T')[0] || '--'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<style>
	.members-page { max-width: 1100px; }

	.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.page-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #191923; }

	.export-btn {
		padding: 0.45rem 1rem;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		color: #374151;
		cursor: pointer;
	}

	.export-btn:hover { background: #f3f4f6; }

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.filters { margin-bottom: 1rem; }

	.search-form { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
	.search-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #374151;
	}

	.search-input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
	.search-btn { padding: 0.5rem 1rem; background: #4f46e5; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.825rem; cursor: pointer; }

	.filter-chips { display: flex; gap: 0.5rem; }
	.chip {
		padding: 0.3rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 9999px;
		font-size: 0.75rem;
		color: #6b7280;
		text-decoration: none;
		transition: all 0.15s;
	}

	.chip:hover { background: #f3f4f6; }
	.chip.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

	.table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
	.empty-state { padding: 2rem; text-align: center; color: #9ca3af; }

	.data-table { width: 100%; border-collapse: collapse; }
	.data-table th { background: #f9fafb; padding: 0.65rem 0.75rem; text-align: left; font-size: 0.7rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
	.data-table td { padding: 0.65rem 0.75rem; font-size: 0.825rem; color: #374151; border-bottom: 1px solid #f3f4f6; }

	.name-cell { font-weight: 500; }
	.member-link { color: #4f46e5; text-decoration: none; }
	.member-link:hover { text-decoration: underline; }
	.email-cell { color: #6b7280; font-size: 0.8rem; }
	.date-cell { font-size: 0.75rem; color: #9ca3af; }

	.club-badge { font-size: 0.6rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 9999px; margin-right: 0.2rem; }
	.club-badge.astro { background: #eef2ff; color: #4f46e5; }
	.club-badge.phys { background: #e0f2fe; color: #0e79b2; }

	.inline-form { display: inline; }
	.role-select {
		padding: 0.2rem 0.4rem;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		color: #374151;
		cursor: pointer;
	}

	.verify-badge { font-size: 0.7rem; font-weight: 500; padding: 0.1rem 0.4rem; border-radius: 9999px; }
	.verify-badge.verified { background: #dcfce7; color: #16a34a; }
	.verify-badge.unverified { background: #fef3c7; color: #d97706; }

	.filter-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }

	.interest-select {
		padding: 0.3rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		color: #374151;
		background: #fff;
		cursor: pointer;
	}

	.interest-select:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }

	.interests-cell { display: flex; flex-wrap: wrap; gap: 0.2rem; align-items: center; }

	.interest-badge {
		font-size: 0.6rem;
		font-weight: 500;
		padding: 0.1rem 0.4rem;
		border-radius: 9999px;
		background: #f0f0ff;
		color: #4f46e5;
		white-space: nowrap;
	}

	.interest-more { font-size: 0.6rem; color: #9ca3af; padding: 0.1rem 0.2rem; }
	.no-prefs { color: #d1d5db; font-size: 0.75rem; }
</style>
