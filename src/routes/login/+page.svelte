<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { form, data } = $props();
</script>

<svelte:head>
	<title>Sign In - UICSpacetime</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<div class="login-header">
			<h1 class="login-title">UICSpacetime</h1>
			<p class="login-subtitle">Member Sign In</p>
		</div>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form method="POST" action="?/login" use:enhance>
			<BotProtection />
			{#if data.redirectTo}
				<input type="hidden" name="redirectTo" value={data.redirectTo} />
			{/if}
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required autocomplete="email" placeholder="netid@uic.edu" value={form?.email ?? ''} />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input type="password" id="password" name="password" required autocomplete="current-password" placeholder="Enter password" />
			</div>

			<button type="submit" class="submit-btn">Sign In</button>
		</form>

		<div class="links">
			<a href="/forgot-password">Forgot password?</a>
			<a href="/register{data.redirectTo ? `?redirectTo=${encodeURIComponent(data.redirectTo)}` : ''}">Create an account</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.login-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #fff;
	}

	.login-subtitle {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-top: 0.25rem;
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
		transition: border-color 0.15s;
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
		transition: background 0.15s;
	}

	.submit-btn:hover {
		background: #4338ca;
	}

	.links {
		display: flex;
		justify-content: space-between;
		margin-top: 1.25rem;
	}

	.links a {
		font-size: 0.8rem;
		color: #818cf8;
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>
