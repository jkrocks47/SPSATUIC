<script lang="ts">
	import AmbientParticles from '$lib/components/astronomy/AmbientParticles.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Join | UIC Astronomy Club</title>
</svelte:head>

<section class="join-page relative min-h-screen overflow-hidden">
	<!-- Background nebula atmosphere -->
	<div class="absolute inset-0 join-bg"></div>
	<div class="absolute inset-0 pointer-events-none opacity-20 grid-overlay"></div>
	<AmbientParticles count={30} color="rgba(255,240,220,0.2)" speed={0.06} />

	<div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
		<!-- Header — brutalist, left-aligned -->
		<div class="mb-16">
			<p class="font-mono text-[10px] tracking-[0.3em] text-astro-cream/30 uppercase mb-3">
				{data.content['page-subtitle'] ?? 'UIC ASTRONOMY CLUB // MEMBERSHIP'}
			</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream uppercase" style="line-height: 0.92;">
				{data.content['page-title'] ?? 'JOIN THE OBSERVATORY'}
			</h1>
			<div class="mt-4 h-px w-20 bg-astro-cream/15"></div>
		</div>

		<!-- Two-column layout: benefits + registration CTA -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
			<!-- Left column: What you get -->
			<div class="lg:col-span-3 space-y-8">
				<p class="font-body text-base text-astro-cream/55 max-w-lg">
					{data.content['intro-text'] ?? 'No experience necessary. All UIC students are welcome regardless of major or year. Create an account to RSVP for events, access the gallery, and join the community.'}
				</p>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
					{#each [
						{ icon: '&#9790;', title: data.content['benefit-1-title'] ?? 'Observing Sessions', desc: data.content['benefit-1-body'] ?? 'Telescope access and guided nights on campus rooftops and at dark sky sites.' },
						{ icon: '&#9733;', title: data.content['benefit-2-title'] ?? 'Guest Lectures', desc: data.content['benefit-2-body'] ?? 'Hear from astronomers, astrophysicists, and researchers at the frontier.' },
						{ icon: '&#9788;', title: data.content['benefit-3-title'] ?? 'Workshops', desc: data.content['benefit-3-body'] ?? 'Astrophotography, telescope operation, celestial navigation — hands on.' },
						{ icon: '&#10038;', title: data.content['benefit-4-title'] ?? 'Community', desc: data.content['benefit-4-body'] ?? 'Connect with fellow space enthusiasts. Build friendships under the stars.' }
					] as benefit}
						<div class="benefit-card">
							<div class="flex items-start gap-3">
								<span class="font-mono text-lg text-astro-cyan/60 flex-shrink-0">{@html benefit.icon}</span>
								<div>
									<h3 class="font-display text-sm font-bold text-astro-cream uppercase tracking-[0.06em] mb-1">{benefit.title}</h3>
									<p class="font-body text-xs text-astro-cream/40 leading-relaxed">{benefit.desc}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right column: Registration CTA card -->
			<div class="lg:col-span-2">
				<div class="register-card">
					<!-- Corner brackets -->
					<div class="absolute top-2 left-2 w-4 h-4 border-l border-t border-astro-cyan/20"></div>
					<div class="absolute top-2 right-2 w-4 h-4 border-r border-t border-astro-cyan/20"></div>
					<div class="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-astro-cyan/20"></div>
					<div class="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-astro-cyan/20"></div>

					<div class="p-8">
						<p class="font-mono text-[9px] tracking-[0.25em] text-astro-cyan/40 uppercase mb-4">
							&#9679; REGISTRATION PORTAL
						</p>

						<h2 class="font-display text-xl font-bold text-astro-cream mb-3">
							{data.content['cta-title'] ?? 'Create Your Account'}
						</h2>

						<p class="font-body text-sm text-astro-cream/45 mb-6 leading-relaxed">
							{data.content['cta-body'] ?? "Register with your @uic.edu email to become a member. You'll be able to RSVP for events, manage your profile, and stay updated."}
						</p>

						<div class="space-y-3">
							<!-- Preview of what registration involves -->
							<div class="flex items-center gap-3 text-astro-cream/30">
								<span class="font-mono text-[10px] w-5 h-5 rounded-full border border-astro-cream/15 flex items-center justify-center flex-shrink-0">1</span>
								<span class="font-body text-xs">Choose new or returning member</span>
							</div>
							<div class="flex items-center gap-3 text-astro-cream/30">
								<span class="font-mono text-[10px] w-5 h-5 rounded-full border border-astro-cream/15 flex items-center justify-center flex-shrink-0">2</span>
								<span class="font-body text-xs">Create account with UIC email</span>
							</div>
							<div class="flex items-center gap-3 text-astro-cream/30">
								<span class="font-mono text-[10px] w-5 h-5 rounded-full border border-astro-cream/15 flex items-center justify-center flex-shrink-0">3</span>
								<span class="font-body text-xs">Select clubs & interests</span>
							</div>
						</div>

						<a href="/register" class="register-btn">
							[ REGISTER NOW ]
						</a>

						<p class="mt-5 font-mono text-[9px] text-astro-cream/20 tracking-wider text-center">
							Already a member? <a href="/login" class="text-astro-cyan/40 hover:text-astro-cyan/70 transition-colors no-underline">Sign in</a>
						</p>
					</div>
				</div>

				<!-- Additional links -->
				<div class="mt-6 space-y-3">
					<a href="/astronomy/events" class="secondary-link">
						<span class="font-mono text-[10px] text-astro-cream/25">&#8594;</span>
						<span class="font-body text-xs text-astro-cream/35 hover:text-astro-cream/60 transition-colors">View upcoming events</span>
					</a>
					<a href="/astronomy/contact" class="secondary-link">
						<span class="font-mono text-[10px] text-astro-cream/25">&#8594;</span>
						<span class="font-body text-xs text-astro-cream/35 hover:text-astro-cream/60 transition-colors">Contact us</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.join-page {
		background: #080510;
	}

	.join-bg {
		background:
			radial-gradient(ellipse 60% 50% at 20% 30%, rgba(80,30,120,0.2) 0%, transparent 60%),
			radial-gradient(ellipse 40% 40% at 75% 60%, rgba(34,160,200,0.08) 0%, transparent 55%),
			radial-gradient(ellipse 50% 40% at 50% 20%, rgba(232,120,50,0.1) 0%, transparent 50%),
			linear-gradient(to bottom, #0c0618 0%, #080510 100%);
	}

	.benefit-card {
		padding: 1rem;
		border: 1px solid rgba(255,255,255,0.04);
		background: rgba(255,255,255,0.02);
		transition: border-color 0.3s ease;
	}

	.benefit-card:hover {
		border-color: rgba(34,211,238,0.15);
	}

	.register-card {
		position: relative;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(34,211,238,0.15);
		transition: border-color 0.3s ease;
	}

	.register-card:hover {
		border-color: rgba(34,211,238,0.3);
	}

	.register-btn {
		display: block;
		width: 100%;
		margin-top: 1.75rem;
		padding: 0.75rem;
		text-align: center;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #f5f0e8;
		background: rgba(34,211,238,0.1);
		border: 1px solid rgba(34,211,238,0.3);
		text-decoration: none;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.register-btn:hover {
		background: rgba(34,211,238,0.2);
		border-color: rgba(34,211,238,0.5);
		box-shadow: 0 0 25px rgba(34,211,238,0.12);
	}

	.secondary-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
	}
</style>
