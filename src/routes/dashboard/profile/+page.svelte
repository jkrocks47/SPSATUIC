<script lang="ts">
	import { enhance } from '$app/forms';
	import { YEARS, EVENT_PREFERENCES } from '$lib/utils/constants';

	let { data, form } = $props();
	let uploading = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);
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

	<!-- Profile Photo Section -->
	<div class="profile-card photo-section">
		<div class="photo-header">
			<label>Profile Photo</label>
			{#if data.profile.role === 'board'}
				<span class="sync-badge">Synced to board page</span>
			{/if}
		</div>

		{#if form?.photoError}
			<div class="error-message">{form.photoError}</div>
		{/if}
		{#if form?.photoSuccess}
			<div class="success-message">Photo updated.</div>
		{/if}
		{#if form?.photoRemoved}
			<div class="success-message">Photo removed.</div>
		{/if}

		<div class="photo-area">
			{#if data.profile.profileImageUrl}
				<img src="{data.profile.profileImageUrl}?variant=thumbnail" alt="Profile" class="profile-avatar" />
			{:else}
				<div class="profile-avatar placeholder">
					{data.profile.firstName.charAt(0)}{data.profile.lastName.charAt(0)}
				</div>
			{/if}

			<div class="photo-actions">
				<form method="POST" action="?/uploadPhoto" enctype="multipart/form-data" use:enhance={() => {
					uploading = true;
					return async ({ update }) => {
						uploading = false;
						await update({ reset: false });
					};
				}}>
					<input
						bind:this={fileInput}
						type="file"
						name="photo"
						accept="image/jpeg,image/png,image/webp,image/gif"
						class="file-input-hidden"
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					/>
					<button type="button" class="photo-btn" disabled={uploading} onclick={() => fileInput?.click()}>
						{uploading ? 'Uploading...' : data.profile.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
					</button>
				</form>

				{#if data.profile.profileImageUrl}
					<form method="POST" action="?/removePhoto" use:enhance={() => {
						return async ({ update }) => {
							await update({ reset: false });
						};
					}}>
						<button type="submit" class="photo-btn remove">Remove</button>
					</form>
				{/if}
			</div>
		</div>
		<span class="hint">JPEG, PNG, WebP, or GIF. Max 25MB.</span>
	</div>

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

			<div class="form-group">
				<label>Email Preferences</label>
				<div class="checkbox-row">
					<label class="checkbox-label">
						<input type="checkbox" name="emailOptOut" checked={data.profile.emailOptOut} />
						Opt out of event reminders and announcements
					</label>
				</div>
				<span class="hint">Account emails (verification, password reset) will always be sent.</span>
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

	.photo-section {
		margin-bottom: 1rem;
	}

	.photo-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.photo-header label {
		font-size: 0.8rem;
		font-weight: 500;
		color: #d1d5db;
	}

	.sync-badge {
		font-size: 0.65rem;
		background: rgba(79, 70, 229, 0.15);
		color: #a5b4fc;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		border: 1px solid rgba(79, 70, 229, 0.3);
	}

	.photo-area {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.profile-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
	}

	.profile-avatar.placeholder {
		background: rgba(79, 70, 229, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 600;
		color: #a5b4fc;
	}

	.photo-actions {
		display: flex;
		gap: 0.5rem;
	}

	.file-input-hidden {
		display: none;
	}

	.photo-btn {
		padding: 0.4rem 0.9rem;
		background: rgba(255, 255, 255, 0.08);
		color: #d1d5db;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		font-size: 0.78rem;
		cursor: pointer;
	}

	.photo-btn:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	.photo-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.photo-btn.remove {
		color: #fca5a5;
		border-color: rgba(220, 38, 38, 0.3);
	}

	.photo-btn.remove:hover {
		background: rgba(220, 38, 38, 0.1);
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style>
