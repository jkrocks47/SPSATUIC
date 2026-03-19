<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { canManageClub } from '$lib/utils/constants';

	let { children } = $props();

	let sidebarOpen = $state(true);

	const membershipLinks = [
		{ href: '/admin/members', label: 'Members' },
		{ href: '/admin/announcements', label: 'Announcements' },
		{ href: '/admin/content', label: 'Site Content' }
	];

	const astronomyLinks = [
		{ href: '/admin/astronomy', label: 'Dashboard' },
		{ href: '/admin/astronomy/events', label: 'Events' },
		{ href: '/admin/astronomy/gallery', label: 'Gallery' },
		{ href: '/admin/astronomy/officers', label: 'Officers' },
		{ href: '/admin/astronomy/content', label: 'Content' }
	];

	const physicsLinks = [
		{ href: '/admin/physics', label: 'Dashboard' },
		{ href: '/admin/physics/events', label: 'Events' },
		{ href: '/admin/physics/gallery', label: 'Gallery' },
		{ href: '/admin/physics/officers', label: 'Officers' },
		{ href: '/admin/physics/content', label: 'Content' }
	];

	let currentPath = $derived($page.url.pathname);
	let member = $derived($page.data.currentUser);
	let canManageAstronomy = $derived(canManageClub(member?.adminRole ?? null, 'astronomy'));
	let canManagePhysics = $derived(canManageClub(member?.adminRole ?? null, 'physics'));
</script>

{#if !member?.adminRole}
	{@render children()}
{:else}
	<div class="admin-layout">
		<!-- Sidebar -->
		<aside class="sidebar" class:collapsed={!sidebarOpen}>
			<div class="sidebar-header">
				<a href="/admin" class="sidebar-logo">
					<span class="logo-text">UICSpacetime</span>
					<span class="logo-sub">Admin</span>
				</a>
			</div>

			<nav class="sidebar-nav">
				<a href="/admin" class="nav-item" class:active={currentPath === '/admin'}>
					<span class="nav-icon">&#9632;</span>
					Dashboard
				</a>

				<div class="nav-section">
					<span class="nav-section-label">Membership</span>
					{#each membershipLinks as link}
						<a href={link.href} class="nav-item" class:active={currentPath === link.href}>
							{link.label}
						</a>
					{/each}
				</div>

				{#if canManageAstronomy}
				<div class="nav-section">
					<span class="nav-section-label">Astronomy</span>
					{#each astronomyLinks as link}
						<a href={link.href} class="nav-item" class:active={currentPath === link.href}>
							{link.label}
						</a>
					{/each}
				</div>
				{/if}

				{#if canManagePhysics}
				<div class="nav-section">
					<span class="nav-section-label">Physics</span>
					{#each physicsLinks as link}
						<a href={link.href} class="nav-item" class:active={currentPath === link.href}>
							{link.label}
						</a>
					{/each}
				</div>
				{/if}

				<div class="nav-section">
					<span class="nav-section-label">Quick Links</span>
					<a href="/dashboard" class="nav-item">
						My Dashboard
					</a>
					{#if canManageAstronomy}
					<a href="/astronomy" class="nav-item" target="_blank">
						Astronomy Site ↗
					</a>
					{/if}
					{#if canManagePhysics}
					<a href="/physics" class="nav-item" target="_blank">
						Physics Site ↗
					</a>
					{/if}
				</div>
			</nav>
		</aside>

		<!-- Main area -->
		<div class="main-area">
			<header class="top-bar">
				<button class="toggle-btn" onclick={() => sidebarOpen = !sidebarOpen}>
					&#9776;
				</button>
				<div class="top-bar-right">
					<span class="user-name">{member.firstName} {member.lastName}</span>
					<span class="user-role">({member.adminRole})</span>
					<form method="POST" action="/admin?/logout" use:enhance>
						<button type="submit" class="logout-btn">Logout</button>
					</form>
				</div>
			</header>

			<main class="content">
				{@render children()}
			</main>
		</div>
	</div>
{/if}

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
		background: #f3f4f6;
	}

	.sidebar {
		width: 250px;
		background: #191923;
		color: #e5e7eb;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		transition: width 0.3s ease, transform 0.3s ease;
		overflow: hidden;
	}

	.sidebar.collapsed {
		width: 0;
		transform: translateX(-250px);
	}

	.sidebar-header {
		padding: 1.25rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.sidebar-logo {
		text-decoration: none;
		display: flex;
		flex-direction: column;
	}

	.logo-text {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
	}

	.logo-sub {
		font-family: 'Inter', sans-serif;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.75rem 0;
		overflow-y: auto;
	}

	.nav-section {
		margin-top: 1rem;
	}

	.nav-section-label {
		display: block;
		padding: 0.5rem 1.25rem;
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.35);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1.25rem;
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 0.875rem;
		transition: background 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.05);
		color: #fff;
	}

	.nav-item.active {
		background: rgba(79, 70, 229, 0.25);
		color: #c4b5fd;
		border-right: 2px solid #4f46e5;
	}

	.nav-icon {
		font-size: 0.5rem;
	}

	/* Main area */
	.main-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.5rem;
		background: #fff;
		border-bottom: 1px solid #e5e7eb;
	}

	.toggle-btn {
		background: none;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		padding: 0.4rem 0.6rem;
		cursor: pointer;
		font-size: 1rem;
		color: #374151;
	}

	.toggle-btn:hover {
		background: #f3f4f6;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	.user-role {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.logout-btn {
		background: none;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.8rem;
		color: #6b7280;
		cursor: pointer;
		margin-left: 0.5rem;
		transition: all 0.15s;
	}

	.logout-btn:hover {
		background: #fee2e2;
		border-color: #fca5a5;
		color: #dc2626;
	}

	.content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			z-index: 50;
			height: 100vh;
		}

		.sidebar.collapsed {
			transform: translateX(-250px);
		}
	}
</style>
