<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	interface Props {
		dark: boolean;
		toggleDark: () => void;
	}

	let { dark, toggleDark }: Props = $props();

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
		? (dark ? 'bg-[#1e1e2a]/95 shadow-sm backdrop-blur-md' : 'bg-white/95 shadow-sm backdrop-blur-md')
		: (dark ? 'bg-[#1e1e2a]/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm')}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<a href="/" class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors duration-200 no-underline">
					&larr; Spacetime
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

				<!-- Dark Mode Toggle -->
				<button
					onclick={toggleDark}
					class="relative w-10 h-[22px] rounded-full border-0 cursor-pointer transition-colors duration-300 flex-shrink-0 {dark ? 'bg-physics-blue/30' : 'bg-physics-dark/10'}"
					aria-label="Toggle dark mode"
				>
					<span
						class="absolute top-[3px] w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] {dark ? 'left-[22px] bg-physics-blue' : 'left-[3px] bg-white shadow-sm'}"
					>
						{#if dark}
							<svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
							</svg>
						{:else}
							<svg class="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
							</svg>
						{/if}
					</span>
				</button>

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

			<!-- Mobile Hamburger + Dark Toggle -->
			<div class="md:hidden flex items-center gap-2">
				<button
					onclick={toggleDark}
					class="p-2 bg-transparent border-0 cursor-pointer text-physics-dark/60"
					aria-label="Toggle dark mode"
				>
					{#if dark}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
						</svg>
					{/if}
				</button>
				<button
					class="text-physics-dark p-2 bg-transparent border-0 cursor-pointer"
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
		</div>

		<!-- Mobile Menu -->
		{#if mobileOpen}
			<div class="md:hidden pb-4 border-t border-physics-dark/10 mt-2 pt-4 flex flex-col gap-4">
				<a
					href="/"
					class="font-body text-sm text-physics-dark/60 hover:text-physics-blue transition-colors no-underline"
					onclick={() => (mobileOpen = false)}
				>
					&larr; Spacetime
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
