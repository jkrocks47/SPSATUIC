<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Check In - {data.event.title} | UICSpacetime</title>
</svelte:head>

<div class="checkin-container">
	<div class="checkin-card">
		<h1 class="checkin-title">UICSpacetime</h1>
		<p class="checkin-subtitle">Event Check-In</p>

		{#if data.success}
			<div class="icon success-icon">&#10003;</div>
			<h2>Checked In!</h2>
			<p class="event-name">{data.event.title}</p>
			<p class="event-date">{data.event.date}</p>
			{#if data.joinedClub}
				<p class="joined-club">You've joined the {data.event.clubType === 'astronomy' ? 'Astronomy' : 'Physics'} Club!</p>
			{/if}
			<p class="message">You've been successfully checked in. Enjoy the event!</p>
		{:else if data.alreadyCheckedIn}
			<div class="icon info-icon">&#8505;</div>
			<h2>Already Checked In</h2>
			<p class="event-name">{data.event.title}</p>
			<p class="message">You're already checked in for this event.</p>
		{/if}

		<a href="/dashboard" class="action-btn">Go to Dashboard</a>
	</div>
</div>

<style>
	.checkin-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.checkin-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 440px;
		text-align: center;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.checkin-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
	}

	.checkin-subtitle {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		margin-bottom: 1.5rem;
	}

	.icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-icon { color: #22c55e; }
	.info-icon { color: #818cf8; }

	h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 0.5rem;
	}

	.event-name {
		font-size: 1rem;
		font-weight: 500;
		color: #c4b5fd;
		margin-bottom: 0.25rem;
	}

	.event-date {
		font-size: 0.8rem;
		color: #6b7280;
		margin-bottom: 0.75rem;
	}

	.joined-club {
		font-size: 0.85rem;
		font-weight: 500;
		color: #22c55e;
		background: rgba(34, 197, 94, 0.1);
		border: 1px solid rgba(34, 197, 94, 0.2);
		border-radius: 0.375rem;
		padding: 0.5rem 0.75rem;
		margin-bottom: 0.75rem;
	}

	.message {
		font-size: 0.875rem;
		color: #9ca3af;
		margin-bottom: 1.25rem;
	}

	.action-btn {
		display: inline-block;
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.action-btn:hover {
		background: #4338ca;
	}
</style>
