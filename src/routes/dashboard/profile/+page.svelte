<script lang="ts">
	import { enhance } from '$app/forms';
	import { YEARS, EVENT_PREFERENCES } from '$lib/utils/constants';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Profile - UICSpacetime</title>
</svelte:head>

<div class="profile-page">
	<h1 class="page-title">Profile</h1>

	{#if form?.success}
		<div class="success-message">Profile updated successfully.</div>
	{/if}

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	<div class="profile-card">
		<form method="POST" action="?/update" use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}>

			<div class="form-row">
				<div class="form-group">
					<label for="firstName">First Name *</label>
					<input type="text" id="firstName" name="firstName" required value={data.profile.firstName} />
				</div>
				<div class="form-group">
					<label for="lastName">Last Name *</label>
					<input type="text" id="lastName" name="lastName" required value={data.profile.lastName} />
				</div>
			</div>

			<div class="form-group">
				<label>Email</label>
				<input type="email" disabled value={data.profile.email} />
				<span class="hint">Email cannot be changed</span>
			</div>

			<div class="form-group">
				<label for="secondaryEmail">Secondary Email</label>
				<input type="email" id="secondaryEmail" name="secondaryEmail" value={data.profile.secondaryEmail ?? ''} placeholder="Optional personal email" />
				<span class="hint">An optional non-UIC email for backup contact</span>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="year">Year</label>
					<select id="year" name="year">
						<option value="">Select...</option>
						{#each YEARS as year}
							<option value={year} selected={data.profile.year === year}>{year}</option>
						{/each}
					</select>
				</div>
				<div class="form-group">
					<label for="major">Major</label>
					<input type="text" id="major" name="major" value={data.profile.major ?? ''} />
				</div>
			</div>

			<div class="form-group">
				<label>Clubs *</label>
				<div class="checkbox-row">
					<label class="checkbox-label">
						<input type="checkbox" name="astronomyMember" checked={data.profile.astronomyMember} />
						Astronomy Club
					</label>
					<label class="checkbox-label">
						<input type="checkbox" name="physicsMember" checked={data.profile.physicsMember} />
						Physics Club (SPS)
					</label>
				</div>
			</div>

			<div class="form-group">
				<label>Event Interests</label>
				<div class="checkbox-grid">
					{#each EVENT_PREFERENCES as pref}
						<label class="checkbox-label">
							<input type="checkbox" name="eventPreferences" value={pref} checked={(data.profile.eventPreferences ?? []).includes(pref)} />
							{pref}
						</label>
					{/each}
				</div>
			</div>

			<button type="submit" class="submit-btn">Save Changes</button>
		</form>
	</div>
</div>

<style>
	.profile-page {
		max-width: 600px;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.success-message {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #86efac;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.error-message {
		background: rgba(220, 38, 38, 0.1);
		border: 1px solid rgba(220, 38, 38, 0.3);
		color: #fca5a5;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.profile-card {
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-group {
		margin-bottom: 1.1rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #d1d5db;
		margin-bottom: 0.3rem;
	}

	.form-group input[type='text'],
	.form-group input[type='email'],
	.form-group select {
		width: 100%;
		padding: 0.55rem 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #e5e7eb;
	}

	.form-group input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
	}

	.hint {
		font-size: 0.7rem;
		color: #6b7280;
		display: block;
		margin-top: 0.2rem;
	}

	.checkbox-row,
	.checkbox-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		color: #d1d5db;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		accent-color: #4f46e5;
	}

	.submit-btn {
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		margin-top: 0.5rem;
	}

	.submit-btn:hover {
		background: #4338ca;
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
