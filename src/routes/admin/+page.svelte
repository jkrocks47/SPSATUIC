<script lang="ts">
	import { enhance } from '$app/forms';
	import { canManageClub } from '$lib/utils/constants';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { data, form } = $props();

	let member = $derived(data.member);
	let interestBreakdown = $derived(data.interestBreakdown ?? []);
	let membershipStats = $derived(data.membershipStats);
	let sortedByTotal = $derived([...interestBreakdown].sort((a, b) => b.total - a.total));
	let maxCount = $derived(sortedByTotal.length > 0 ? sortedByTotal[0].total : 1);
	let topInterest = $derived(sortedByTotal.length > 0 ? sortedByTotal[0] : null);
	let canManageAstronomy = $derived(canManageClub(member?.adminRole ?? null, 'astronomy'));
	let canManagePhysics = $derived(canManageClub(member?.adminRole ?? null, 'physics'));
</script>

<svelte:head>
	<title>{member?.adminRole ? 'Admin Dashboard' : 'Admin Login'} - UICSpacetime</title>
</svelte:head>

{#if !member?.adminRole}
	<!-- Login Form -->
	<div class="login-container">
		<div class="login-card">
			<div class="login-header">
				<h1 class="login-title">UICSpacetime</h1>
				<p class="login-subtitle">Admin Panel</p>
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance>
				<BotProtection />
				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						autocomplete="email"
						placeholder="admin@uic.edu"
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						autocomplete="current-password"
						placeholder="Enter password"
					/>
				</div>

				<button type="submit" class="submit-btn">Sign In</button>
			</form>
		</div>
	</div>
{:else}
	<!-- Dashboard -->
	<div class="dashboard">
		<h1 class="dashboard-title">Welcome, {member.firstName}</h1>
		<p class="dashboard-subtitle">Manage your club content from here.</p>

		{#if membershipStats}
			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-value">{membershipStats.totalMembers}</span>
					<span class="stat-label">Total Members</span>
				</div>
				<div class="stat-card">
					<span class="stat-value astro">{membershipStats.astronomyMembers}</span>
					<span class="stat-label">Astronomy</span>
				</div>
				<div class="stat-card">
					<span class="stat-value phys">{membershipStats.physicsMembers}</span>
					<span class="stat-label">Physics</span>
				</div>
				<div class="stat-card">
					<span class="stat-value pref">{membershipStats.membersWithPreferences}</span>
					<span class="stat-label">With Preferences</span>
				</div>
			</div>

			<div class="interest-section">
				<div class="section-header">
					<h2 class="section-title">Interest Breakdown</h2>
					<span class="section-hint">What members want — plan events around these</span>
				</div>

				<div class="interest-bars">
					{#each sortedByTotal as interest}
						<div class="interest-row">
							<div class="interest-label">
								<span class="interest-name">{interest.preference}</span>
								<span class="interest-count">{interest.total}</span>
							</div>
							<div class="bar-track">
								<div
									class="bar-fill"
									style="width: {maxCount > 0 ? (interest.total / maxCount) * 100 : 0}%"
								></div>
							</div>
							<div class="interest-clubs">
								<span class="mini-badge astro" title="Astronomy members">{interest.astronomyCount}</span>
								<span class="mini-badge phys" title="Physics members">{interest.physicsCount}</span>
							</div>
						</div>
					{/each}
				</div>

				{#if topInterest && topInterest.total > 0}
					<div class="insight-callout">
						<strong>Top interest:</strong> {topInterest.preference} ({topInterest.total} members).
						{#if sortedByTotal.length > 1}
							Consider planning more {topInterest.preference.toLowerCase()} events.
							{#if sortedByTotal[sortedByTotal.length - 1].total === 0}
								"{sortedByTotal[sortedByTotal.length - 1].preference}" has no interest — consider removing it from registration.
							{/if}
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		<div class="dashboard-cards">
			{#if canManageAstronomy}
			<a href="/admin/astronomy" class="dash-card astronomy-card">
				<div class="card-icon">&#10022;</div>
				<h2>Astronomy Club</h2>
				<p>Manage events, gallery, and content for the Astronomy Club.</p>
				<span class="card-link">Go to Astronomy Admin &rarr;</span>
			</a>
			{/if}

			{#if canManagePhysics}
			<a href="/admin/physics" class="dash-card physics-card">
				<div class="card-icon">&#9883;</div>
				<h2>Physics Club</h2>
				<p>Manage events, gallery, and content for the Physics Club.</p>
				<span class="card-link">Go to Physics Admin &rarr;</span>
			</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Login */
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #f3f4f6;
	}

	.login-card {
		background: #fff;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #191923;
	}

	.login-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.35rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #374151;
		transition: border-color 0.15s;
	}

	.form-group input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
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

	/* Dashboard */
	.dashboard {
		max-width: 900px;
	}

	.dashboard-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #191923;
	}

	.dashboard-subtitle {
		font-size: 0.9rem;
		color: #6b7280;
		margin-top: 0.25rem;
		margin-bottom: 2rem;
	}

	.dashboard-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.dash-card {
		background: #fff;
		border-radius: 0.75rem;
		padding: 1.75rem;
		text-decoration: none;
		border: 1px solid #e5e7eb;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.dash-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.card-icon {
		font-size: 2rem;
		margin-bottom: 0.75rem;
	}

	.astronomy-card .card-icon {
		color: #4f46e5;
	}

	.physics-card .card-icon {
		color: #0e79b2;
	}

	.dash-card h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #191923;
		margin-bottom: 0.5rem;
	}

	.dash-card p {
		font-size: 0.85rem;
		color: #6b7280;
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.card-link {
		font-size: 0.8rem;
		font-weight: 500;
		color: #4f46e5;
	}

	.physics-card .card-link {
		color: #0e79b2;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1.25rem;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #191923;
	}

	.stat-value.astro { color: #4f46e5; }
	.stat-value.phys { color: #0e79b2; }
	.stat-value.pref { color: #7c3aed; }

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.25rem;
		display: block;
	}

	/* Interest Section */
	.interest-section {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1.25rem;
	}

	.section-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #191923;
	}

	.section-hint {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.interest-bars {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.interest-row {
		display: grid;
		grid-template-columns: 140px 1fr 60px;
		align-items: center;
		gap: 0.75rem;
	}

	.interest-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.interest-name {
		font-size: 0.85rem;
		color: #374151;
		font-weight: 500;
	}

	.interest-count {
		font-size: 0.75rem;
		font-weight: 600;
		color: #4f46e5;
	}

	.bar-track {
		height: 0.5rem;
		background: #f3f4f6;
		border-radius: 9999px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		background: #4f46e5;
		border-radius: 9999px;
		transition: width 0.3s ease;
		min-width: 2px;
	}

	.interest-clubs {
		display: flex;
		gap: 0.25rem;
	}

	.mini-badge {
		font-size: 0.6rem;
		font-weight: 600;
		padding: 0.1rem 0.35rem;
		border-radius: 9999px;
		min-width: 1.2rem;
		text-align: center;
	}

	.mini-badge.astro { background: #eef2ff; color: #4f46e5; }
	.mini-badge.phys { background: #e0f2fe; color: #0e79b2; }

	.insight-callout {
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		color: #374151;
		line-height: 1.5;
	}

	.insight-callout strong { color: #4f46e5; }

	@media (max-width: 768px) {
		.stats-grid { grid-template-columns: repeat(2, 1fr); }
		.interest-row { grid-template-columns: 100px 1fr 50px; }
	}
</style>
