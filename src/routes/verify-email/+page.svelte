<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let resending = $state(false);
	let cooldown = $state(false);

	$effect(() => {
		if (form?.resent) {
			cooldown = true;
			const timer = setTimeout(() => { cooldown = false; }, 3 * 60 * 1000);
			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>Verify Email - UICSpacetime</title>
</svelte:head>

<div class="verify-container">
	<div class="verify-card">
		<h1 class="verify-title">UICSpacetime</h1>

		{#if data.verified || form?.verified}
			<div class="icon success-icon">&#10003;</div>
			<h2>Email Verified!</h2>
			<p>Your email has been verified successfully. You can now access your dashboard.</p>
			<a href="/dashboard" class="action-btn">Go to Dashboard</a>
		{:else if data.tokenValid}
			<div class="icon pending-icon">&#9993;</div>
			<h2>Confirm Verification</h2>
			<p>Click the button below to verify your email address.</p>
			{#if form?.verifyError}
				<div class="error-msg">{form.verifyError}</div>
			{/if}
			<form
				method="POST"
				action="?/verify"
				use:enhance={() => {
					resending = true;
					return async ({ update }) => {
						resending = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="action-btn" disabled={resending}>
					{resending ? 'Verifying...' : 'Verify My Email'}
				</button>
			</form>
		{:else if data.error || form?.verifyError}
			<div class="icon error-icon">&#10007;</div>
			<h2>Verification Failed</h2>
			<p>{data.error || form?.verifyError}</p>
			<a href="/login" class="action-btn">Sign In</a>
			<p class="hint">Need a new link? <a href="/verify-email">Resend verification email</a></p>
		{:else}
			<div class="icon pending-icon">&#9993;</div>
			<h2>Check Your Email</h2>
			<p>We've sent a verification link to your UIC email address. Please check your inbox and click the link to verify your account.</p>

			<div class="spam-notice">
				⚠ Check your <strong>junk or spam folder</strong> — <strong>Outlook</strong> often filters these emails. It may also take 3–4 minutes to arrive.
			</div>

			{#if form?.resent}
				<div class="resent-msg">Verification email sent! Check your inbox.</div>
			{/if}

			{#if form?.resendError}
				<div class="error-msg">{form.resendError}</div>
			{/if}

			<form
				method="POST"
				action="?/resend"
				use:enhance={() => {
					resending = true;
					return async ({ update }) => {
						resending = false;
						await update();
					};
				}}
			>
				<button type="submit" class="resend-btn" disabled={resending || cooldown}>
					{#if resending}
						Sending...
					{:else if cooldown}
						Email Sent — Check Your Inbox
					{:else}
						Resend Verification Email
					{/if}
				</button>
			</form>

			<p class="hint">Already verified? <a href="/login">Sign in</a> to continue.</p>

			<form method="POST" action="?/logout" use:enhance>
				<button type="submit" class="logout-btn">Log Out</button>
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

	.spam-notice {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid rgba(245, 158, 11, 0.35);
		border-radius: 0.5rem;
		font-size: 0.85rem;
		color: #fcd34d;
		line-height: 1.5;
	}

	.spam-notice strong { color: #fde68a; }

	.resend-btn {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.resend-btn:hover:not(:disabled) {
		background: #4338ca;
	}

	.resend-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.resent-msg {
		margin-top: 1rem;
		padding: 0.5rem 0.75rem;
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.2);
		border-radius: 0.375rem;
		color: #4ade80;
		font-size: 0.8rem;
	}

	.error-msg {
		margin-top: 1rem;
		padding: 0.5rem 0.75rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: 0.375rem;
		color: #f87171;
		font-size: 0.8rem;
	}

	.hint {
		font-size: 0.8rem;
		color: #6b7280;
		margin-top: 1rem;
	}

	.hint a {
		color: #818cf8;
		text-decoration: none;
	}

	.action-btn {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.action-btn:hover {
		background: #4338ca;
	}

	.logout-btn {
		margin-top: 1.25rem;
		padding: 0.5rem 1.25rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.15);
		color: #9ca3af;
		border-radius: 0.375rem;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.logout-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
		color: #f87171;
	}
</style>
