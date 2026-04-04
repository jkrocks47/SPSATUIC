<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Forgot Password - UICSpacetime</title>
</svelte:head>

<div class="forgot-container">
	<div class="forgot-card">
		<h1 class="forgot-title">UICSpacetime</h1>
		<p class="forgot-subtitle">Password Reset</p>

		{#if form?.success}
			<div class="success-message">
				If an account with that email exists, we've sent a password reset link. Please check your inbox.
			</div>
		{:else}
			{#if form?.error}
				<div class="error-message">{form.error}</div>
			{/if}

			<p class="description">Enter your email address and we'll send you a link to reset your password.</p>

			<form method="POST" action="?/request" use:enhance>
				<BotProtection />
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" required placeholder="netid@uic.edu" />
				</div>

				<button type="submit" class="submit-btn">Send Reset Link</button>
			</form>
		{/if}

		<a href="/login" class="back-link">&larr; Back to sign in</a>
	</div>
</div>

<style>
	.forgot-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.forgot-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.forgot-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
		text-align: center;
	}

	.forgot-subtitle {
		text-align: center;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-top: 0.25rem;
		margin-bottom: 1.5rem;
	}

	.description {
		font-size: 0.875rem;
		color: #9ca3af;
		margin-bottom: 1.25rem;
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

	.success-message {
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.3);
		color: #86efac;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #d1d5db;
		margin-bottom: 0.35rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.6rem 0.75rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #e5e7eb;
	}

	.form-group input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
	}

	.submit-btn {
		width: 100%;
		padding: 0.65rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
	}

	.submit-btn:hover {
		background: #4338ca;
	}

	.back-link {
		display: block;
		text-align: center;
		margin-top: 1.25rem;
		font-size: 0.8rem;
		color: #818cf8;
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}
</style>
