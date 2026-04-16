<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ClubLogo from './ClubLogo.svelte';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navLinks = [
		{ label: 'ABOUT', href: '/astronomy/about' },
		{ label: 'OBSERVE', href: '/astronomy/events' },
		{ label: 'GALLERY', href: '/astronomy/gallery' },
		{ label: 'BOARD', href: '/astronomy/board' },
		{ label: 'JOIN', href: '/astronomy/join' },
		{ label: 'CONTACT', href: '/astronomy/contact' }
	];

	$effect(() => {
		if (!browser) return;

		const onScroll = () => {
			scrolled = window.scrollY > 50;
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="frosted-nav fixed top-0 left-0 w-full z-40 transition-all duration-300 {scrolled ? 'frosted-nav-scrolled nav-scrolled-glow' : ''}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Row 1: Brand + Club Logo -->
		<div class="flex items-center justify-between pt-3 pb-2">
			<a href="/astronomy" class="flex items-center gap-3 no-underline">
				<span class="font-mono text-[9px] tracking-[0.3em] text-astro-cream/40 uppercase" style="writing-mode: vertical-rl; transform: rotate(180deg);">SPS</span>
				<span class="font-display text-2xl md:text-3xl font-bold tracking-[0.08em] text-astro-cream uppercase">
					UIC ASTRONOMY
				</span>
			</a>

			<div class="flex items-center gap-4">
				<!-- Mobile Hamburger -->
				<button
					class="md:hidden text-astro-cream p-2"
					aria-label="Toggle menu"
					onclick={() => (mobileOpen = !mobileOpen)}
				>
					{#if mobileOpen}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					{/if}
				</button>
				<div class="hidden md:block">
					<ClubLogo size="xs" />
				</div>
			</div>
		</div>

		<!-- Divider line -->
		<div class="hidden md:block h-px bg-white/10"></div>

		<!-- Row 2: Nav links + Search + Login -->
		<div class="hidden md:flex items-center justify-between py-2.5">
			<!-- Nav Links with + separators -->
			<div class="flex items-center gap-3">
				<a
					href="/"
					class="nav-link-hover font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors duration-200 no-underline"
				>
					← SPACETIME
				</a>
				<span class="font-mono text-xs text-white/15 select-none">+</span>
				{#each navLinks as link, i}
					{#if i > 0}
						<span class="font-mono text-xs text-white/15 select-none">+</span>
					{/if}
					<a
						href={link.href}
						class="nav-link-hover font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors duration-200 no-underline"
					>
						{link.label}
					</a>
				{/each}
			</div>

			<!-- Right Section: Search + Login -->
			<div class="flex items-center gap-5">
				<button
					class="text-astro-cream/60 hover:text-astro-cream transition-colors"
					aria-label="Search"
				>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="7" cy="7" r="5" />
						<line x1="11" y1="11" x2="14" y2="14" />
					</svg>
				</button>
				{#if $page.data.member}
					<a
						href="/dashboard"
						class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream hover:border-astro-cream/70 hover:bg-astro-cream/5 border border-astro-cream/40 px-3 py-1.5 transition-all duration-200 no-underline"
					>
						DASHBOARD
					</a>
				{:else}
					<a
						href="/register?redirectTo={$page.url.pathname}"
						class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream hover:border-astro-cream/70 hover:bg-astro-cream/5 border border-astro-cream/40 px-3 py-1.5 transition-all duration-200 no-underline"
					>
						SIGN IN / JOIN
					</a>
				{/if}
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileOpen}
			<div class="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 flex flex-col gap-4">
				<a
					href="/"
					class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors no-underline"
					onclick={() => (mobileOpen = false)}
				>
					← SPACETIME
				</a>
				{#each navLinks as link}
					<a
						href={link.href}
						class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors no-underline"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div class="flex items-center gap-5 pt-2 border-t border-white/10">
					<button
						class="text-astro-cream/60 hover:text-astro-cream transition-colors"
						aria-label="Search"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
							<circle cx="7" cy="7" r="5" />
							<line x1="11" y1="11" x2="14" y2="14" />
						</svg>
					</button>
					{#if $page.data.member}
						<a
							href="/dashboard"
							class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors no-underline"
							onclick={() => (mobileOpen = false)}
						>
							DASHBOARD
						</a>
					{:else}
						<a
							href="/register?redirectTo={$page.url.pathname}"
							class="font-mono text-xs tracking-[0.2em] text-astro-cream/70 hover:text-astro-cream transition-colors no-underline"
							onclick={() => (mobileOpen = false)}
						>
							SIGN IN / JOIN
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	.nav-scrolled-glow {
		box-shadow: 0 1px 0 0 rgba(79, 70, 229, 0.15);
	}
</style>
