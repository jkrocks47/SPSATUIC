<script lang="ts">
	import { enhance } from '$app/forms';
	import MemberSearchInput from '$lib/components/admin/MemberSearchInput.svelte';

	let { data, form } = $props();

	let showForm = $state(false);
	let editingId = $state<string | null>(null);
</script>

<svelte:head>
	<title>Astronomy Officers - UICSpacetime Admin</title>
</svelte:head>

<div class="officers-page">
	<div class="page-header">
		<h1 class="page-title">Astronomy Officers</h1>
		<button class="add-btn" onclick={() => { showForm = !showForm; editingId = null; }}>
			{showForm ? 'Cancel' : '+ Add Officer'}
		</button>
	</div>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">Officer saved successfully.</div>
	{/if}

	{#if showForm}
		<div class="form-card">
			<h2>New Officer</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => {
					await update();
					showForm = false;
				};
			}}>
				<div class="form-grid">
					<div class="form-group">
						<label for="name">Name *</label>
						<input type="text" id="name" name="name" required />
					</div>

					<div class="form-group">
						<label for="position">Position *</label>
						<input type="text" id="position" name="position" required placeholder="e.g. President" />
					</div>

					<div class="form-group">
						<label for="email">Email</label>
						<input type="email" id="email" name="email" />
					</div>

					<div class="form-group">
						<label for="academicYear">Academic Year</label>
						<input type="text" id="academicYear" name="academicYear" placeholder="e.g. 2025-2026" />
					</div>

					<div class="form-group full-width">
						<label for="bio">Bio</label>
						<textarea id="bio" name="bio" rows="3"></textarea>
					</div>

					<div class="form-group">
						<label for="sortOrder">Sort Order</label>
						<input type="number" id="sortOrder" name="sortOrder" value="0" min="0" />
					</div>

					<div class="form-group">
						<label for="memberId-search">Link Member Account</label>
						<MemberSearchInput members={data.members} />
					</div>
				</div>

				<div class="form-actions">
					<button type="submit" class="submit-btn">Create Officer</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="table-card">
		{#if data.officers.length === 0}
			<p class="empty-state">No officers yet. Add your first officer above.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Position</th>
						<th>Email</th>
						<th>Linked Member</th>
						<th>Order</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.officers as officer}
						<tr>
							<td class="title-cell">{officer.name}</td>
							<td>{officer.position}</td>
							<td>{officer.email || '--'}</td>
							<td>
								{#if officer.memberId}
									<span class="member-link">{officer.memberFirstName} {officer.memberLastName}</span>
								{:else}
									<span class="no-data">--</span>
								{/if}
							</td>
							<td>{officer.sortOrder}</td>
							<td class="actions-cell">
								<button class="action-btn-sm" onclick={() => editingId = editingId === officer.id ? null : officer.id}>Edit</button>
								<form method="POST" action="?/delete" use:enhance class="inline-form">
									<input type="hidden" name="id" value={officer.id} />
									<button type="submit" class="delete-btn" onclick={(e) => {
										if (!confirm('Delete this officer?')) e.preventDefault();
									}}>Delete</button>
								</form>
							</td>
						</tr>

						{#if editingId === officer.id}
							<tr>
								<td colspan="6" class="edit-row">
									<form method="POST" action="?/update" use:enhance={() => {
										return async ({ update }) => {
											await update();
											editingId = null;
										};
									}}>
										<input type="hidden" name="id" value={officer.id} />
										<div class="form-grid">
											<div class="form-group">
												<label>Name *</label>
												<input type="text" name="name" required value={officer.name} />
											</div>
											<div class="form-group">
												<label>Position *</label>
												<input type="text" name="position" required value={officer.position} />
											</div>
											<div class="form-group">
												<label>Email</label>
												<input type="email" name="email" value={officer.email || ''} />
											</div>
											<div class="form-group">
												<label>Academic Year</label>
												<input type="text" name="academicYear" value={officer.academicYear || ''} />
											</div>
											<div class="form-group full-width">
												<label>Bio</label>
												<textarea name="bio" rows="3">{officer.bio || ''}</textarea>
											</div>
											<div class="form-group">
												<label>Sort Order</label>
												<input type="number" name="sortOrder" value={officer.sortOrder} min="0" />
											</div>
											<div class="form-group">
												<label>Link Member Account</label>
												<MemberSearchInput members={data.members} selectedId={officer.memberId ?? ''} />
											</div>
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
	.officers-page { max-width: 1100px; }

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
	}

	.add-btn {
		padding: 0.5rem 1rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.825rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.add-btn:hover { background: #4338ca; }

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.form-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-card h2 {
		font-size: 1.1rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 1rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.full-width { grid-column: 1 / -1; }

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.3rem;
	}

	.form-group input[type='text'],
	.form-group input[type='email'],
	.form-group input[type='number'],
	.form-group textarea {
		width: 100%;
		padding: 0.5rem 0.65rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #374151;
	}

	.form-group textarea { resize: vertical; }

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.form-actions {
		margin-top: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.submit-btn {
		padding: 0.5rem 1.25rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.825rem;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:hover { background: #4338ca; }

	.cancel-btn {
		padding: 0.5rem 1.25rem;
		background: transparent;
		border: 1px solid #d1d5db;
		color: #6b7280;
		border-radius: 0.375rem;
		font-size: 0.825rem;
		cursor: pointer;
	}

	.table-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

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

	.data-table td {
		padding: 0.75rem 1rem;
		font-size: 0.85rem;
		color: #374151;
		border-bottom: 1px solid #f3f4f6;
	}

	.title-cell { font-weight: 500; }
	.no-data { color: #d1d5db; }

	.member-link {
		color: #4f46e5;
		font-size: 0.8rem;
	}

	.actions-cell {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}

	.action-btn-sm {
		background: none;
		border: 1px solid #d1d5db;
		color: #374151;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.action-btn-sm:hover { background: #f3f4f6; }

	.inline-form { display: inline; }

	.delete-btn {
		background: none;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.delete-btn:hover { background: #fef2f2; }

	.edit-row {
		background: #f9fafb;
		padding: 1.25rem !important;
	}

	@media (max-width: 640px) {
		.form-grid { grid-template-columns: 1fr; }
	}
</style>
