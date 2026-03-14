<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Email Preferences - UICSpacetime</title>
</svelte:head>

<div class="verify-container">
	<div class="verify-card">
		<h1 class="verify-title">UICSpacetime</h1>

		{#if form?.unsubscribed}
			<div class="icon success-icon">&#10003;</div>
			<h2>Unsubscribed</h2>
			<p>You've been unsubscribed from event reminders and announcements. You'll still receive account emails like password resets.</p>
			<form method="POST" action="?/resubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="action-btn secondary">Changed your mind? Resubscribe</button>
			</form>
		{:else if form?.resubscribed}
			<div class="icon success-icon">&#10003;</div>
			<h2>Resubscribed</h2>
			<p>Welcome back! You'll receive event reminders and announcements again.</p>
			<a href="/dashboard" class="action-btn">Go to Dashboard</a>
		{:else if form?.error}
			<div class="icon error-icon">&#10007;</div>
			<h2>Something went wrong</h2>
			<p>{form.error}</p>
		{:else if !data.valid}
			<div class="icon error-icon">&#10007;</div>
			<h2>Invalid Link</h2>
			<p>This unsubscribe link is invalid. If you'd like to manage your email preferences, visit your profile settings.</p>
			<a href="/dashboard/profile" class="action-btn">Go to Profile</a>
		{:else if data.optedOut}
			<div class="icon pending-icon">&#9993;</div>
			<h2>Already Unsubscribed</h2>
			<p>You're already unsubscribed from event reminders and announcements.</p>
			<form method="POST" action="?/resubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="action-btn secondary">Want to resubscribe?</button>
			</form>
		{:else}
			<div class="icon pending-icon">&#9993;</div>
			<h2>Unsubscribe from Emails</h2>
			<p>You'll stop receiving event reminders and announcements. Account emails like password resets will still be sent.</p>
			<form method="POST" action="?/unsubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="action-btn">Unsubscribe</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.verify-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.verify-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 440px;
		text-align: center;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.verify-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-icon { color: #22c55e; }
	.error-icon { color: #ef4444; }
	.pending-icon { color: #818cf8; }

	h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 0.75rem;
	}

	p {
		font-size: 0.9rem;
		color: #9ca3af;
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}

	.action-btn {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.action-btn:hover {
		background: #4338ca;
	}

	.action-btn.secondary {
		background: transparent;
		border: 1px solid rgba(79, 70, 229, 0.4);
		color: #818cf8;
	}

	.action-btn.secondary:hover {
		background: rgba(79, 70, 229, 0.1);
	}
</style>
