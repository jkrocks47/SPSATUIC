<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navLinks = [
		{ label: 'About', href: '/physics/about' },
		{ label: 'Events', href: '/physics/events' },
		{ label: 'Gallery', href: '/physics/gallery' },
		{ label: 'Board', href: '/physics/board' },
		{ label: 'Join', href: '/physics/join' },
		{ label: 'Contact', href: '/physics/contact' }
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
	class="fixed top-0 left-0 w-full z-40 transition-all duration-300 {scrolled
		? 'bg-white/95 shadow-sm backdrop-blur-md'
		: 'bg-white/80 backdrop-blur-sm'}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<a href="/" class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors duration-200 no-underline">
					← Spacetime
				</a>
				<a href="/physics" class="flex items-center gap-2 no-underline">
					<span class="font-body text-lg font-semibold tracking-tight text-physics-dark">
						Physics Club
					</span>
				</a>
			</div>

			<!-- Desktop Nav Links -->
			<div class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors duration-200 no-underline"
					>
						{link.label}
					</a>
				{/each}
				{#if $page.data.member}
					<a
						href="/dashboard"
						class="font-body text-sm font-medium text-physics-blue border border-physics-blue/40 px-3 py-1.5 rounded hover:bg-physics-blue/10 hover:border-physics-blue/70 transition-all duration-200 no-underline"
					>
						Dashboard
					</a>
				{:else}
					<a
						href="/login?redirectTo={$page.url.pathname}"
						class="font-body text-sm font-medium text-physics-blue border border-physics-blue/40 px-3 py-1.5 rounded hover:bg-physics-blue/10 hover:border-physics-blue/70 transition-all duration-200 no-underline"
					>
						Sign In / Join
					</a>
				{/if}
			</div>

			<!-- Mobile Hamburger -->
			<button
				class="md:hidden text-physics-dark p-2 bg-transparent border-0 cursor-pointer"
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
		</div>

		<!-- Mobile Menu -->
		{#if mobileOpen}
			<div class="md:hidden pb-4 border-t border-physics-dark/10 mt-2 pt-4 flex flex-col gap-4">
				<a
					href="/"
					class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors no-underline"
					onclick={() => (mobileOpen = false)}
				>
					← Spacetime
				</a>
				{#each navLinks as link}
					<a
						href={link.href}
						class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors no-underline"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				{#if $page.data.member}
					<a
						href="/dashboard"
						class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors no-underline"
						onclick={() => (mobileOpen = false)}
					>
						Dashboard
					</a>
				{:else}
					<a
						href="/login?redirectTo={$page.url.pathname}"
						class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors no-underline"
						onclick={() => (mobileOpen = false)}
					>
						Sign In / Join
					</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>
