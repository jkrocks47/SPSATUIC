<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';

	let { children } = $props();

	let isMobile = $state(false);
	let sidebarOpen = $state(false);
	let currentPath = $derived($page.url.pathname);
	let member = $derived($page.data.member);

	const navLinks = [
		{ href: '/dashboard', label: 'Overview', icon: '&#9632;' },
		{ href: '/dashboard/events', label: 'My Events', icon: '&#9733;' },
		{ href: '/dashboard/profile', label: 'Profile', icon: '&#9881;' }
	];

	$effect(() => {
		if (!browser) return;
		const mql = window.matchMedia('(max-width: 768px)');
		isMobile = mql.matches;
		if (!mql.matches) sidebarOpen = true;

		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
			if (e.matches) sidebarOpen = false;
		};
		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = (isMobile && sidebarOpen) ? 'hidden' : '';
	});

	function handleNavClick() {
		if (isMobile) sidebarOpen = false;
	}
</script>

<svelte:window onkeydown={(e) => {
	if (e.key === 'Escape' && isMobile && sidebarOpen) sidebarOpen = false;
}} />

<div class="dashboard-layout">
	{#if isMobile && sidebarOpen}
		<div
			class="sidebar-backdrop"
			onclick={() => sidebarOpen = false}
			role="button"
			tabindex="-1"
			aria-label="Close sidebar"
		></div>
	{/if}

	<aside class="sidebar" class:collapsed={!sidebarOpen}>
		<div class="sidebar-header">
			<a href="/" class="sidebar-logo">
				<span class="logo-text">UICSpacetime</span>
				<span class="logo-sub">Member</span>
			</a>
		</div>

		<nav class="sidebar-nav">
			{#each navLinks as link}
				<a href={link.href} class="nav-item" class:active={currentPath === link.href} onclick={handleNavClick}>
					<span class="nav-icon">{@html link.icon}</span>
					{link.label}
				</a>
			{/each}
		</nav>
	</aside>

	<div class="main-area">
		<header class="top-bar">
			<button class="toggle-btn" onclick={() => sidebarOpen = !sidebarOpen}>&#9776;</button>
			<div class="top-bar-right">
				<span class="user-name">{member.displayName}</span>
				<div class="member-clubs">
					{#if member.astronomyMember}<span class="club-badge astro">Astro</span>{/if}
					{#if member.physicsMember}<span class="club-badge phys">Physics</span>{/if}
				</div>
				<form method="POST" action="/api/member/logout" use:enhance>
					<button type="submit" class="logout-btn">Logout</button>
				</form>
			</div>
		</header>

		<main class="content">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.dashboard-layout {
		display: flex;
		min-height: 100vh;
		background: #0a0a0f;
	}

	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 40;
	}

	.sidebar {
		width: 240px;
		background: #191923;
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		transition: width 0.3s ease;
		overflow: hidden;
		border-right: 1px solid rgba(255, 255, 255, 0.06);
	}

	.sidebar.collapsed {
		width: 0;
	}

	.sidebar-header {
		padding: 1.25rem 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.sidebar-logo {
		text-decoration: none;
		display: flex;
		flex-direction: column;
	}

	.logo-text {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		color: #fff;
	}

	.logo-sub {
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.35);
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.75rem 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.65rem 1.25rem;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		font-size: 0.875rem;
		transition: background 0.15s, color 0.15s;
	}

	.nav-item:hover {
		background: rgba(255, 255, 255, 0.04);
		color: #fff;
	}

	.nav-item.active {
		background: rgba(79, 70, 229, 0.2);
		color: #c4b5fd;
		border-right: 2px solid #4f46e5;
	}

	.nav-icon {
		font-size: 0.6rem;
	}

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
		background: #191923;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.toggle-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		padding: 0.4rem 0.6rem;
		cursor: pointer;
		font-size: 1rem;
		color: #d1d5db;
	}

	.top-bar-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.user-name {
		font-size: 0.85rem;
		font-weight: 500;
		color: #e5e7eb;
	}

	.member-clubs {
		display: flex;
		gap: 0.35rem;
	}

	.club-badge {
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.15rem 0.45rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.club-badge.astro {
		background: rgba(79, 70, 229, 0.2);
		color: #a5b4fc;
	}

	.club-badge.phys {
		background: rgba(14, 121, 178, 0.2);
		color: #7dd3fc;
	}

	.logout-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 0.375rem;
		padding: 0.3rem 0.65rem;
		font-size: 0.75rem;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.15s;
	}

	.logout-btn:hover {
		background: rgba(220, 38, 38, 0.15);
		border-color: rgba(220, 38, 38, 0.4);
		color: #fca5a5;
	}

	.content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 50;
			height: 100vh;
			width: 240px;
			transition: transform 0.3s ease;
		}

		.sidebar.collapsed {
			width: 240px;
			transform: translateX(-100%);
		}
	}

	@media (max-width: 480px) {
		.user-name {
			display: none;
		}

		.top-bar-right {
			gap: 0.4rem;
		}

		.top-bar {
			padding: 0.75rem 0.75rem;
		}

		.content {
			padding: 1rem;
		}
	}
</style>
