<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showForm = $state(false);

	const adminRole = data.currentUser?.adminRole;
	const isSuperAdmin = adminRole === 'super_admin';
</script>

<svelte:head>
	<title>Announcements - UICSpacetime Admin</title>
</svelte:head>

<div class="announcements-page">
	<div class="page-header">
		<h1 class="page-title">Announcements</h1>
		<button class="add-btn" onclick={() => showForm = !showForm}>
			{showForm ? 'Cancel' : '+ New Announcement'}
		</button>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">Announcement saved.</div>
	{/if}

	{#if showForm}
		<div class="form-card">
			<h2>New Announcement</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => { await update(); showForm = false; };
			}}>
				<div class="form-group">
					<label for="title">Title *</label>
					<input type="text" id="title" name="title" required />
				</div>
				<div class="form-group">
					<label for="body">Body *</label>
					<textarea id="body" name="body" rows="4" required></textarea>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label for="clubType">Club</label>
						<select id="clubType" name="clubType">
							{#if isSuperAdmin}
								<option value="">Both Clubs</option>
								<option value="astronomy">Astronomy Only</option>
								<option value="physics">Physics Only</option>
							{:else if adminRole === 'astronomy_admin'}
								<option value="astronomy">Astronomy</option>
							{:else if adminRole === 'physics_admin'}
								<option value="physics">Physics</option>
							{/if}
						</select>
					</div>
					<div class="form-group checkbox-group">
						<label><input type="checkbox" name="isPinned" /> Pinned</label>
					</div>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label for="publishAt">Publish At</label>
						<input type="datetime-local" id="publishAt" name="publishAt" />
					</div>
					<div class="form-group">
						<label for="expiresAt">Expires At</label>
						<input type="datetime-local" id="expiresAt" name="expiresAt" />
					</div>
				</div>
				<button type="submit" class="submit-btn">Create Announcement</button>
			</form>
		</div>
	{/if}

	<div class="table-card">
		{#if data.announcements.length === 0}
			<p class="empty-state">No announcements yet.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Club</th>
						<th>Pinned</th>
						<th>Expires</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.announcements as ann}
						<tr>
							<td class="title-cell">{ann.title}</td>
							<td>{ann.clubType || 'Both'}</td>
							<td>
								<form method="POST" action="?/togglePin" use:enhance class="inline-form">
									<input type="hidden" name="id" value={ann.id} />
									<button type="submit" class="pin-btn" class:pinned={ann.isPinned}>
										{ann.isPinned ? 'Pinned' : 'Unpin'}
									</button>
								</form>
							</td>
							<td class="date-cell">{ann.expiresAt ? ann.expiresAt.toISOString().split('T')[0] : '--'}</td>
							<td>
								<form method="POST" action="?/delete" use:enhance class="inline-form">
									<input type="hidden" name="id" value={ann.id} />
									<button type="submit" class="delete-btn" onclick={(e) => {
										if (!confirm('Delete this announcement?')) e.preventDefault();
									}}>Delete</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<style>
	.announcements-page { max-width: 900px; }
	.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
	.page-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #191923; }
	.add-btn { padding: 0.5rem 1rem; background: #4f46e5; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.825rem; font-weight: 500; cursor: pointer; }
	.add-btn:hover { background: #4338ca; }
	.error-message { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }
	.success-message { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; margin-bottom: 1rem; }
	.form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; }
	.form-card h2 { font-size: 1.1rem; font-weight: 600; color: #374151; margin-bottom: 1rem; }
	.form-group { margin-bottom: 1rem; }
	.form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: #374151; margin-bottom: 0.3rem; }
	.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.5rem 0.65rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.85rem; color: #374151; }
	.form-group textarea { resize: vertical; }
	.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
	.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; margin-top: 1.5rem; }
	.submit-btn { padding: 0.5rem 1.25rem; background: #4f46e5; color: #fff; border: none; border-radius: 0.375rem; font-size: 0.825rem; font-weight: 500; cursor: pointer; }
	.table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
	.empty-state { padding: 2rem; text-align: center; color: #9ca3af; }
	.data-table { width: 100%; border-collapse: collapse; }
	.data-table th { background: #f9fafb; padding: 0.65rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
	.data-table td { padding: 0.75rem 1rem; font-size: 0.85rem; color: #374151; border-bottom: 1px solid #f3f4f6; }
	.title-cell { font-weight: 500; }
	.date-cell { font-size: 0.75rem; color: #9ca3af; }
	.inline-form { display: inline; }
	.pin-btn { background: none; border: 1px solid #d1d5db; padding: 0.15rem 0.5rem; border-radius: 9999px; font-size: 0.7rem; cursor: pointer; }
	.pin-btn.pinned { background: #fef3c7; border-color: #fde68a; color: #d97706; }
	.delete-btn { background: none; border: 1px solid #fecaca; color: #dc2626; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; }
	.delete-btn:hover { background: #fef2f2; }
</style>
