<script lang="ts">
	import type { RsvpStatus } from '$lib/utils/constants';

	let {
		eventId,
		currentStatus = null,
		isLoggedIn = false,
		isVerified = false,
		redirectTo = ''
	}: {
		eventId: string;
		currentStatus: RsvpStatus | null;
		isLoggedIn: boolean;
		isVerified: boolean;
		redirectTo?: string;
	} = $props();

	let status = $state<RsvpStatus | null>(currentStatus);
	let loading = $state(false);

	async function handleRsvp(newStatus: RsvpStatus) {
		if (loading) return;
		loading = true;

		try {
			const res = await fetch('/api/member/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventId, status: newStatus })
			});

			if (res.ok) {
				status = newStatus;
			}
		} finally {
			loading = false;
		}
	}
</script>

{#if !isLoggedIn}
	<div class="rsvp-buttons">
		<span class="rsvp-label">RSVP</span>
		<div class="rsvp-primary-row">
			<a class="rsvp-btn going" href="/register{redirectTo ? `?redirectTo=${redirectTo}` : ''}">&#10003; Going</a>
		</div>
		<div class="rsvp-secondary-row">
			<a class="rsvp-btn maybe" href="/register{redirectTo ? `?redirectTo=${redirectTo}` : ''}">Maybe</a>
			<a class="rsvp-btn not-going" href="/register{redirectTo ? `?redirectTo=${redirectTo}` : ''}">Not Going</a>
		</div>
		<a href="/login{redirectTo ? `?redirectTo=${redirectTo}` : ''}" class="rsvp-signin-hint">Already a member? Sign in</a>
	</div>
{:else if !isVerified}
	<div class="rsvp-prompt">
		<span class="rsvp-verify-msg">Verify your email to RSVP</span>
	</div>
{:else}
	<div class="rsvp-buttons">
		<span class="rsvp-label">RSVP</span>
		<div class="rsvp-primary-row">
			<button
				class="rsvp-btn going"
				class:active={status === 'going'}
				disabled={loading}
				onclick={() => handleRsvp('going')}
			>&#10003; Going</button>
		</div>
		<div class="rsvp-secondary-row">
			<button
				class="rsvp-btn maybe"
				class:active={status === 'maybe'}
				disabled={loading}
				onclick={() => handleRsvp('maybe')}
			>Maybe</button>
			<button
				class="rsvp-btn not-going"
				class:active={status === 'not_going'}
				disabled={loading}
				onclick={() => handleRsvp('not_going')}
			>Not Going</button>
		</div>
	</div>
{/if}

<style>
	.rsvp-prompt {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rsvp-signin-hint {
		display: block;
		text-align: center;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.45);
		text-decoration: none;
		margin-top: 0.25rem;
	}

	.rsvp-signin-hint:hover {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: underline;
	}

	a.rsvp-btn {
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.rsvp-verify-msg {
		font-size: 0.85rem;
		color: #6b7280;
	}

	.rsvp-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rsvp-label {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.4);
	}

	.rsvp-primary-row {
		display: flex;
	}

	.rsvp-secondary-row {
		display: flex;
		gap: 0.5rem;
	}

	.rsvp-btn {
		border-radius: 0.625rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.6);
	}

	.rsvp-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Primary Going button — large and prominent */
	.rsvp-btn.going {
		width: 100%;
		padding: 0.85rem 1.25rem;
		font-size: 1rem;
		background: rgba(34, 197, 94, 0.15);
		border-color: rgba(34, 197, 94, 0.35);
		color: #86efac;
	}

	.rsvp-btn.going:hover:not(:disabled) {
		background: rgba(34, 197, 94, 0.25);
		border-color: rgba(34, 197, 94, 0.6);
		color: #bbf7d0;
	}

	.rsvp-btn.going.active {
		background: rgba(34, 197, 94, 0.3);
		border-color: rgba(34, 197, 94, 0.7);
		color: #4ade80;
		box-shadow: 0 0 12px rgba(34, 197, 94, 0.2);
	}

	/* Secondary Maybe / Not Going buttons — smaller */
	.rsvp-btn.maybe,
	.rsvp-btn.not-going {
		flex: 1;
		padding: 0.45rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.rsvp-btn.maybe:hover:not(:disabled),
	.rsvp-btn.not-going:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.9);
	}

	.rsvp-btn.maybe.active {
		background: rgba(234, 179, 8, 0.2);
		border-color: rgba(234, 179, 8, 0.5);
		color: #fde047;
	}

	.rsvp-btn.not-going.active {
		background: rgba(220, 38, 38, 0.15);
		border-color: rgba(220, 38, 38, 0.4);
		color: #fca5a5;
	}
</style>
