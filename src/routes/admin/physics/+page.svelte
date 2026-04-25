<script lang="ts">
	import { page } from '$app/stores';
	let { data } = $props();
	let isFaculty = $derived($page.data.currentUser?.adminRole === 'physics_faculty');
</script>

<svelte:head>
	<title>Physics Dashboard - UICSpacetime Admin</title>
</svelte:head>

<div class="club-dashboard">
	<h1 class="page-title">Physics Club Dashboard</h1>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">&#128197;</div>
			<div class="stat-info">
				<span class="stat-value">--</span>
				<span class="stat-label">Events</span>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">&#128247;</div>
			<div class="stat-info">
				<span class="stat-value">--</span>
				<span class="stat-label">Gallery Images</span>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">&#128101;</div>
			<div class="stat-info">
				<span class="stat-value">--</span>
				<span class="stat-label">Officers</span>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">&#128196;</div>
			<div class="stat-info">
				<span class="stat-value">--</span>
				<span class="stat-label">Content Blocks</span>
			</div>
		</div>
	</div>

	<div class="quick-actions">
		<h2>Quick Actions</h2>
		<div class="action-buttons">
			<a href="/admin/physics/events" class="action-btn">Add Event</a>
			{#if !isFaculty}
				<a href="/admin/physics/gallery" class="action-btn">Upload Image</a>
			{/if}
		</div>
	</div>
</div>

<style>
	.club-dashboard {
		max-width: 900px;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: #fff;
		border-radius: 0.5rem;
		padding: 1.25rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid #e5e7eb;
	}

	.stat-icon {
		font-size: 1.5rem;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.quick-actions {
		background: #fff;
		border-radius: 0.5rem;
		padding: 1.25rem;
		border: 1px solid #e5e7eb;
	}

	.quick-actions h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 1rem;
	}

	.action-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.action-btn {
		padding: 0.5rem 1rem;
		background: #0e79b2;
		color: #fff;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.825rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.action-btn:hover {
		background: #0b6290;
	}
</style>
