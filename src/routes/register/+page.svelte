<script lang="ts">
	import { enhance } from '$app/forms';
	import { YEARS, EVENT_PREFERENCES } from '$lib/utils/constants';

	let { form, data } = $props();

	let step = $state(1);
	let memberType = $state<'new' | 'returning' | null>(null);

	// Persist step 2 values in JS state so they survive step navigation
	let firstName = $state(form?.firstName ?? '');
	let lastName = $state(form?.lastName ?? '');
	let email = $state(form?.email ?? '');
	let password = $state('');
</script>

<svelte:head>
	<title>Register - UICSpacetime</title>
</svelte:head>

<div class="register-container">
	<div class="register-card">
		<div class="register-header">
			<h1 class="register-title">UICSpacetime</h1>
			<p class="register-subtitle">Member Registration</p>
		</div>

		<!-- Step indicators -->
		<div class="steps">
			<div class="step" class:active={step === 1} class:done={step > 1}>1</div>
			<div class="step-line" class:done={step > 1}></div>
			<div class="step" class:active={step === 2} class:done={step > 2}>2</div>
			<div class="step-line" class:done={step > 2}></div>
			<div class="step" class:active={step === 3}>3</div>
		</div>

		{#if step === 1}
			<!-- Step 1: New or Returning -->
			<div class="step-content">
				<h2>Are you a new or returning member?</h2>
				<div class="choice-buttons">
					<button class="choice-btn" onclick={() => { memberType = 'new'; step = 2; }}>
						<span class="choice-icon">&#10022;</span>
						<span class="choice-label">New Member</span>
						<span class="choice-desc">I'm joining for the first time</span>
					</button>
					<a href="/login{data?.redirectTo ? `?redirectTo=${encodeURIComponent(data.redirectTo)}` : ''}" class="choice-btn">
						<span class="choice-icon">&#8634;</span>
						<span class="choice-label">Returning Member</span>
						<span class="choice-desc">I already have an account</span>
					</a>
				</div>
			</div>
		{:else}
			<form method="POST" action="?/register" use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}>
				{#if data?.redirectTo}
					<input type="hidden" name="redirectTo" value={data.redirectTo} />
				{/if}
				{#if data?.redirectTo?.includes('/checkin/')}
					<div class="checkin-banner">Registering to check in to an event</div>
				{/if}
				{#if form?.error}
					<div class="error-message">{form.error}</div>
				{/if}

				{#if step === 2}
					<!-- Step 2: Account creation -->
					<div class="step-content">
						<h2>Create your account</h2>

						<div class="form-group">
							<label for="firstName">First Name *</label>
							<input type="text" id="firstName" name="firstName" required bind:value={firstName} />
						</div>

						<div class="form-group">
							<label for="lastName">Last Name *</label>
							<input type="text" id="lastName" name="lastName" required bind:value={lastName} />
						</div>

						<div class="form-group">
							<label for="email">UIC Email *</label>
							<input type="email" id="email" name="email" required placeholder="netid@uic.edu" bind:value={email} />
							<span class="hint">Must be a @uic.edu email</span>
						</div>

						<div class="form-group">
							<label for="password">Password *</label>
							<input type="password" id="password" name="password" required minlength="8" placeholder="Min 8 chars, 1 uppercase, 1 number" bind:value={password} />
						</div>

						<div class="form-actions">
							<button type="button" class="back-btn" onclick={() => step = 1}>Back</button>
							<button type="button" class="next-btn" onclick={() => step = 3}>Next</button>
						</div>
					</div>
				{:else if step === 3}
					<!-- Step 3: Interest form -->
					<div class="step-content">
						<h2>Tell us about yourself</h2>

						<!-- Hidden fields carry step 2 values -->
						<input type="hidden" name="firstName" value={firstName} />
						<input type="hidden" name="lastName" value={lastName} />
						<input type="hidden" name="email" value={email} />
						<input type="hidden" name="password" value={password} />

						<div class="form-row">
							<div class="form-group">
								<label for="year">Year</label>
								<select id="year" name="year">
									<option value="">Select...</option>
									{#each YEARS as year}
										<option value={year}>{year}</option>
									{/each}
								</select>
							</div>

							<div class="form-group">
								<label for="major">Major</label>
								<input type="text" id="major" name="major" placeholder="e.g. Physics" />
							</div>
						</div>

						<div class="form-group">
							<label>Which clubs are you interested in? *</label>
							<div class="checkbox-row">
								<label class="checkbox-label">
									<input type="checkbox" name="astronomyMember" />
									Astronomy Club
								</label>
								<label class="checkbox-label">
									<input type="checkbox" name="physicsMember" />
									Physics Club (SPS)
								</label>
							</div>
						</div>

						<div class="form-group">
							<label>Event interests</label>
							<div class="checkbox-grid">
								{#each EVENT_PREFERENCES as pref}
									<label class="checkbox-label">
										<input type="checkbox" name="eventPreferences" value={pref} />
										{pref}
									</label>
								{/each}
							</div>
						</div>

						<div class="form-actions">
							<button type="button" class="back-btn" onclick={() => step = 2}>Back</button>
							<button type="submit" class="submit-btn">Create Account</button>
						</div>
					</div>
				{/if}
			</form>
		{/if}

		<p class="login-link">Already have an account? <a href="/login{data?.redirectTo ? `?redirectTo=${encodeURIComponent(data.redirectTo)}` : ''}">Sign in</a></p>
	</div>
</div>

<style>
	.register-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.register-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 500px;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.register-header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.register-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
	}

	.register-subtitle {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-top: 0.25rem;
	}

	/* Steps */
	.steps {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		margin-bottom: 2rem;
	}

	.step {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
		background: rgba(255, 255, 255, 0.05);
		color: rgba(255, 255, 255, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.step.active {
		background: #4f46e5;
		color: #fff;
		border-color: #4f46e5;
	}

	.step.done {
		background: #16a34a;
		color: #fff;
		border-color: #16a34a;
	}

	.step-line {
		width: 3rem;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
	}

	.step-line.done {
		background: #16a34a;
	}

	.step-content h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 1.25rem;
	}

	/* Choice buttons */
	.choice-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.choice-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		color: inherit;
	}

	.choice-btn:hover {
		background: rgba(79, 70, 229, 0.1);
		border-color: #4f46e5;
	}

	.choice-icon {
		font-size: 1.5rem;
		color: #4f46e5;
	}

	.choice-label {
		font-weight: 600;
		color: #e5e7eb;
		font-size: 1rem;
	}

	.choice-desc {
		font-size: 0.8rem;
		color: #9ca3af;
	}

	.checkin-banner {
		background: rgba(79, 70, 229, 0.1);
		border: 1px solid rgba(79, 70, 229, 0.3);
		color: #a5b4fc;
		padding: 0.6rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.8rem;
		text-align: center;
		margin-bottom: 1rem;
	}

	/* Form */
	.error-message {
		background: rgba(220, 38, 38, 0.1);
		border: 1px solid rgba(220, 38, 38, 0.3);
		color: #fca5a5;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
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
	.form-group input[type='password'],
	.form-group select {
		width: 100%;
		padding: 0.55rem 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #e5e7eb;
		transition: border-color 0.15s;
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
		margin-top: 0.2rem;
		display: block;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
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

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.back-btn {
		padding: 0.6rem 1.25rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.next-btn,
	.submit-btn {
		flex: 1;
		padding: 0.6rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.next-btn:hover,
	.submit-btn:hover {
		background: #4338ca;
	}

	.login-link {
		text-align: center;
		font-size: 0.8rem;
		color: #6b7280;
		margin-top: 1.5rem;
	}

	.login-link a {
		color: #818cf8;
		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}

	@media (max-width: 480px) {
		.form-row {
			grid-template-columns: 1fr;
		}

		.register-card {
			padding: 1.5rem;
		}
	}
</style>
