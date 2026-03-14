<script lang="ts">
	import { browser } from '$app/environment';
	import AmbientParticles from '$lib/components/astronomy/AmbientParticles.svelte';
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
	import ScrollReveal from '$lib/components/astronomy/ScrollReveal.svelte';
	import EventCalendar from '$lib/components/shared/EventCalendar.svelte';
	import AstronomyPortalCanvas from '$lib/components/shared/AstronomyPortalCanvas.svelte';
	import PhysicsPortalCanvas from '$lib/components/shared/PhysicsPortalCanvas.svelte';

	let { data } = $props();
	let mounted = $state(false);
	let astroHovered = $state(false);
	let physHovered = $state(false);

	$effect(() => {
		if (!browser) return;
		mounted = true;
	});
</script>

<svelte:head>
	<title>UICSpacetime — Society of Physics Students at UIC</title>
	<meta name="description" content="Society of Physics Students at the University of Illinois Chicago — Astronomy & Physics Clubs" />
</svelte:head>

<div class="page">
	{#if mounted}
		<AmbientParticles count={15} color="rgba(206, 17, 38, 0.12)" speed={0.1} />
	{/if}

	<header class="site-header" class:visible={mounted}>
		<div class="top-bar">
			<div class="branding">
				<div class="logo-glow" aria-hidden="true"></div>
				<h1 class="logo">
					<span class="logo-uic">UIC</span>
					<span class="logo-spacetime">Spacetime</span>
				</h1>
				<p class="sps-title">Society of Physics Students at UIC</p>
			</div>
			{#if data.member}
			<a href="/dashboard" class="login-link">Dashboard</a>
		{:else}
			<a href="/login" class="login-link">Sign In / Join</a>
		{/if}
		</div>

		<nav class="club-nav">
			<a
				href="/astronomy"
				class="portal-card portal-astro"
				data-sveltekit-preload-data="hover"
				onmouseenter={() => (astroHovered = true)}
				onmouseleave={() => (astroHovered = false)}
			>
				<div class="portal-bg">
					{#if mounted}<AstronomyPortalCanvas hovered={astroHovered} />{/if}
				</div>
				<div class="portal-content">
					<span class="portal-label">Astronomy Club</span>
					<span class="portal-hint">Visit Astronomy Site &rarr;</span>
				</div>
				<div class="portal-edge edge-astro" aria-hidden="true"></div>
				<div class="portal-pulse pulse-astro" aria-hidden="true"></div>
			</a>
			<a
				href="/physics"
				class="portal-card portal-phys"
				data-sveltekit-preload-data="hover"
				onmouseenter={() => (physHovered = true)}
				onmouseleave={() => (physHovered = false)}
			>
				<div class="portal-bg">
					{#if mounted}<PhysicsPortalCanvas hovered={physHovered} />{/if}
				</div>
				<div class="portal-content">
					<span class="portal-label">Physics Club</span>
					<span class="portal-hint">Visit Physics Site &rarr;</span>
				</div>
				<div class="portal-edge edge-phys" aria-hidden="true"></div>
				<div class="portal-pulse pulse-phys" aria-hidden="true"></div>
			</a>
		</nav>

		<!-- Hero tagline -->
		<div class="hero-tagline">
			<p>{data.content['hero-tagline'] ?? 'Exploring the fundamental laws of the universe, one experiment at a time.'}</p>
			<div class="hero-divider" aria-hidden="true"></div>
		</div>
	</header>

	<main class="main-content" class:visible={mounted}>
		<div class="content-container">
			<!-- Events -->
			<div class="events-blend">
				<EventCalendar events={data.upcomingEvents} isLoggedIn={data.isLoggedIn} isVerified={data.isVerified} />
			</div>

			<!-- Section header -->
			<div class="sps-header">
				<p class="sps-subtitle">{data.content['about-subtitle'] ?? 'SOCIETY OF PHYSICS STUDENTS'}</p>
				<h2 class="sps-heading">{data.content['about-heading'] ?? 'About SPS at UIC'}</h2>
			</div>

			<!-- Mission + Meetings side by side -->
			<ScrollReveal>
				<div class="two-col">
					<GlassPanel class="p-6 sm:p-8">
						<h3 class="section-title">Our Mission</h3>
						{#if data.spsInfo?.aboutText}
							<p class="section-text">{data.spsInfo.aboutText}</p>
						{:else}
							<p class="section-text">
								The Society of Physics Students at UIC is dedicated to the advancement of physics
								education, research, and outreach. Our chapter provides a welcoming environment for
								students of all backgrounds to explore their passion for physics through events,
								research presentations, lab tours, and collaborative study sessions.
							</p>
						{/if}
					</GlassPanel>
					<GlassPanel class="p-6 sm:p-8">
						<h3 class="section-title">Meetings</h3>
						{#if data.spsInfo?.meetingInfo}
							<p class="section-text">{data.spsInfo.meetingInfo}</p>
						{:else}
							<p class="section-text">
								We meet biweekly during the fall and spring semesters. Meetings typically feature
								guest speakers, research presentations from members, or collaborative problem-solving
								sessions. All UIC students are welcome, regardless of major or experience level.
							</p>
						{/if}
					</GlassPanel>
				</div>
			</ScrollReveal>

			<!-- Officers -->
			{#if data.spsOfficers && data.spsOfficers.length > 0}
				<ScrollReveal delay={100}>
					<h3 class="officers-heading">Officers</h3>
					<div class="officers-grid">
						{#each data.spsOfficers as officer}
							<GlassPanel class="p-5 text-center">
								{#if officer.imageUrl}
									<img src={officer.imageUrl} alt={officer.name} class="officer-img" />
								{:else}
									<div class="officer-initial"><span>{officer.name.charAt(0)}</span></div>
								{/if}
								<h4 class="officer-name">{officer.name}</h4>
								<p class="officer-pos">{officer.position}</p>
								{#if officer.bio}<p class="officer-bio">{officer.bio}</p>{/if}
							</GlassPanel>
						{/each}
					</div>
				</ScrollReveal>
			{/if}

			<!-- History — no glass panel, decorative left border -->
			<ScrollReveal delay={150}>
				<div class="history-block">
					<p class="history-lead">
						{data.content['history-lead'] ?? 'Our chapter has been active at UIC for decades, fostering a community of curious minds and future physicists.'}
					</p>
					<p class="section-text">
						{data.content['history-body'] ?? 'We have hosted distinguished speakers, organized trips to national laboratories like Fermilab and Argonne, and supported students in their academic and research pursuits. Our alumni have gone on to careers in academia, industry, and beyond.'}
					</p>
				</div>
			</ScrollReveal>

			<!-- Contact bar — compact, no glass panel -->
			<ScrollReveal delay={200}>
				<div class="contact-bar">
					<div class="contact-info">
						<span class="contact-email">{data.spsInfo?.contactEmail ?? 'sps@uic.edu'}</span>
						<span class="contact-loc">University of Illinois at Chicago</span>
					</div>
					<div class="social-links">
						{#if data.spsInfo?.socialLinks}
							{#each Object.entries(data.spsInfo.socialLinks as Record<string, string>) as [platform, url]}
								<a href={url} target="_blank" rel="noopener noreferrer" class="social-link" aria-label="SPS {platform}">{platform}</a>
							{/each}
						{:else}
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="SPS Instagram">Instagram</a>
							<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="SPS Twitter">Twitter</a>
						{/if}
					</div>
				</div>
			</ScrollReveal>

			<!-- Stats strip -->
			<div class="stats-strip" aria-hidden="true">
				<span>{data.content['stats-1'] ?? 'DECADES ACTIVE'}</span>
				<span class="stats-dot">&bull;</span>
				<span>{data.content['stats-2'] ?? 'FERMILAB TRIPS'}</span>
				<span class="stats-dot">&bull;</span>
				<span>{data.content['stats-3'] ?? 'ALL MAJORS WELCOME'}</span>
			</div>

		</div>
	</main>

	<footer class="site-footer">
		<p>{data.content['footer-text'] ?? 'SPS + UIC + CHICAGO + EST. 2010'}</p>
	</footer>
</div>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(160deg, #060e18 0%, #0d1b2a 30%, #1b2838 55%, #9B0A1A 90%, #CE1126 100%);
		overflow: hidden;
	}

	/* ---- HEADER ---- */
	.site-header {
		position: relative; z-index: 2;
		max-width: 64rem; margin: 0 auto;
		padding: 2rem 1.5rem 0;
		opacity: 0; transform: translateY(-12px);
		transition: opacity 0.7s ease, transform 0.7s ease;
	}
	.site-header.visible { opacity: 1; transform: translateY(0); }

	.top-bar {
		display: flex; align-items: center;
		justify-content: space-between; margin-bottom: 1.75rem;
	}
	.branding { position: relative; }
	.logo-glow {
		position: absolute; top: 50%; left: 0;
		width: 180px; height: 180px; transform: translate(-30%, -50%);
		background: radial-gradient(circle, rgba(206,17,38,0.18) 0%, transparent 70%);
		filter: blur(40px); pointer-events: none;
		animation: glow-breathe 4s ease-in-out infinite;
	}
	.logo {
		position: relative; display: flex;
		align-items: baseline; gap: 0.4rem; line-height: 1;
	}
	.logo-uic {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2.6rem; font-weight: 700; color: #fff;
		text-shadow: 0 0 20px rgba(206,17,38,0.4), 0 0 40px rgba(206,17,38,0.15);
	}
	.logo-spacetime {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem; font-weight: 700;
		color: rgba(255,255,255,0.8); letter-spacing: 0.08em;
	}
	.sps-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1rem; font-weight: 500;
		color: rgba(245,240,232,0.45); letter-spacing: 0.04em; margin-top: 0.35rem;
	}
	.login-link {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
		color: rgba(245,240,232,0.5); text-decoration: none;
		border: 1px solid rgba(245,240,232,0.12);
		padding: 0.5rem 1.4rem; border-radius: 8px;
		transition: all 0.25s ease; background: rgba(255,255,255,0.03);
	}
	.login-link:hover {
		color: #f5f0e8; border-color: rgba(206,17,38,0.5);
		background: rgba(206,17,38,0.1); box-shadow: 0 0 16px rgba(206,17,38,0.15);
	}

	/* ---- PORTAL CARDS ---- */
	.club-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

	.portal-card {
		position: relative; display: flex;
		align-items: flex-end; justify-content: flex-start;
		text-decoration: none; height: 260px; border-radius: 20px;
		overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
		padding: 1.5rem; cursor: pointer;
		transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
	}
	.portal-card:hover { transform: translateY(-3px); }

	/* Dark scrim for text readability */
	.portal-card::after {
		content: ''; position: absolute; bottom: 0; left: 0; right: 0;
		height: 55%; pointer-events: none; z-index: 1;
		background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
		border-radius: 0 0 20px 20px;
	}

	.portal-bg { position: absolute; inset: 0; pointer-events: none; }
	.portal-astro .portal-bg {
		background: radial-gradient(ellipse at 70% 20%, rgba(79,70,229,0.12) 0%, transparent 60%),
			linear-gradient(160deg, rgba(6,6,20,0.95) 0%, rgba(15,15,40,0.9) 100%);
	}
	.portal-phys .portal-bg {
		background: radial-gradient(ellipse at 60% 30%, rgba(14,121,178,0.12) 0%, transparent 60%),
			linear-gradient(160deg, rgba(6,12,20,0.95) 0%, rgba(10,25,40,0.9) 100%);
	}

	.portal-content {
		position: relative; z-index: 2;
		display: flex; flex-direction: column; gap: 0.5rem;
	}
	.portal-label {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.3rem; font-weight: 700;
		color: #fff; letter-spacing: 0.06em; text-transform: uppercase;
		text-shadow: 0 2px 10px rgba(0,0,0,0.5);
	}
	.portal-hint {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem; letter-spacing: 0.06em;
		color: rgba(255,255,255,0.6);
		background: rgba(255,255,255,0.08);
		border: 1px solid rgba(255,255,255,0.1);
		padding: 0.3rem 0.75rem; border-radius: 100px;
		width: fit-content;
		transition: all 0.3s ease;
	}
	.portal-card:hover .portal-hint {
		color: #fff; background: rgba(255,255,255,0.15);
		border-color: rgba(255,255,255,0.25);
	}

	.portal-edge {
		position: absolute; bottom: 0; left: 0; right: 0;
		height: 2px; opacity: 0; transition: opacity 0.35s ease; z-index: 3;
	}
	.edge-astro { background: linear-gradient(90deg, transparent, #a855f7, transparent); }
	.edge-phys { background: linear-gradient(90deg, transparent, #0ea5e9, transparent); }
	.portal-card:hover .portal-edge { opacity: 1; }

	.portal-pulse {
		position: absolute; inset: -1px; border-radius: 20px;
		pointer-events: none; z-index: 0;
	}
	.pulse-astro { animation: pulse-astro 3s ease-in-out infinite; }
	.pulse-phys { animation: pulse-phys 3.5s ease-in-out infinite; }

	@keyframes pulse-astro {
		0%, 100% { box-shadow: inset 0 0 0 1px rgba(168,85,247,0.04), 0 0 12px rgba(168,85,247,0.02); }
		50% { box-shadow: inset 0 0 0 1px rgba(168,85,247,0.12), 0 0 20px rgba(168,85,247,0.06); }
	}
	@keyframes pulse-phys {
		0%, 100% { box-shadow: inset 0 0 0 1px rgba(14,165,233,0.04), 0 0 12px rgba(14,165,233,0.02); }
		50% { box-shadow: inset 0 0 0 1px rgba(14,165,233,0.12), 0 0 20px rgba(14,165,233,0.06); }
	}
	.portal-astro:hover {
		border-color: rgba(168,85,247,0.3);
		box-shadow: 0 8px 32px rgba(168,85,247,0.12), inset 0 1px 0 rgba(168,85,247,0.1);
	}
	.portal-phys:hover {
		border-color: rgba(14,165,233,0.3);
		box-shadow: 0 8px 32px rgba(14,165,233,0.12), inset 0 1px 0 rgba(14,165,233,0.1);
	}

	/* ---- HERO TAGLINE ---- */
	.hero-tagline {
		text-align: center;
		padding: 3rem 1rem 0;
		max-width: 36rem; margin: 0 auto;
	}
	.hero-tagline p {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.35rem; font-weight: 400; font-style: italic;
		color: rgba(245,240,232,0.4); line-height: 1.6;
		letter-spacing: 0.01em;
	}
	.hero-divider {
		margin: 2.5rem auto 0; width: 8rem; height: 1px;
		background: linear-gradient(90deg, transparent, rgba(206,17,38,0.35), transparent);
	}

	/* ---- MAIN CONTENT ---- */
	.main-content {
		position: relative; z-index: 2;
		padding: 2.5rem 1.5rem 2rem;
		opacity: 0; transform: translateY(15px);
		transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
	}
	.main-content.visible { opacity: 1; transform: translateY(0); }
	.content-container { max-width: 48rem; margin: 0 auto; }

	/* Override glass panels for homepage red accent */
	.content-container :global(.glass-panel) {
		background: rgba(10, 18, 30, 0.65);
		border: 1px solid rgba(206, 17, 38, 0.1);
		box-shadow: 0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}
	.content-container :global(.glass-panel:hover) {
		border-color: rgba(206, 17, 38, 0.22);
		box-shadow: 0 6px 32px rgba(206,17,38,0.06), 0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
	}

	.sps-header { text-align: center; margin-bottom: 2rem; }
	.sps-subtitle {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem; letter-spacing: 0.3em;
		color: rgba(206,17,38,0.6); margin-bottom: 0.4rem;
	}
	.sps-heading {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.8rem; font-weight: 700;
		color: #f5f0e8; letter-spacing: 0.02em;
	}

	/* Two-column layout */
	.two-col {
		display: grid; grid-template-columns: 1fr 1fr;
		gap: 0.75rem; margin-bottom: 1.25rem;
	}

	.section-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem; font-weight: 700;
		color: #f5f0e8; margin-bottom: 0.6rem; letter-spacing: 0.02em;
	}
	.section-title::before {
		content: ''; display: inline-block;
		width: 3px; height: 0.9em;
		background: rgba(206,17,38,0.5);
		border-radius: 2px; margin-right: 0.5rem; vertical-align: middle;
	}
	.section-text {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.88rem; line-height: 1.7;
		color: rgba(245,240,232,0.6);
	}

	/* Officers */
	.officers-heading {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem; font-weight: 700;
		color: #f5f0e8; text-align: center; margin-bottom: 0.75rem;
	}
	.officers-grid {
		display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 0.6rem; margin-bottom: 1.5rem;
	}
	.officer-img {
		width: 3.5rem; height: 3.5rem; border-radius: 50%;
		margin: 0 auto 0.4rem; object-fit: cover;
		border: 2px solid rgba(206,17,38,0.15);
	}
	.officer-initial {
		width: 3.5rem; height: 3.5rem; border-radius: 50%;
		margin: 0 auto 0.4rem; background: rgba(206,17,38,0.12);
		display: flex; align-items: center; justify-content: center;
	}
	.officer-initial span {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.2rem; color: rgba(206,17,38,0.5);
	}
	.officer-name {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.85rem; font-weight: 700; color: #f5f0e8;
	}
	.officer-pos {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.55rem; letter-spacing: 0.1em;
		color: rgba(206,17,38,0.5); margin-top: 0.1rem;
	}
	.officer-bio {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.7rem; color: rgba(245,240,232,0.4); margin-top: 0.3rem;
	}

	/* History — decorative left border, no glass panel */
	.history-block {
		border-left: 2px solid rgba(206,17,38,0.25);
		padding: 0.25rem 0 0.25rem 1.5rem;
		margin: 1.5rem 0 1.75rem;
	}
	.history-lead {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.05rem; font-weight: 500; font-style: italic;
		color: rgba(245,240,232,0.5); line-height: 1.6;
		margin-bottom: 0.6rem;
	}

	/* Contact bar — compact */
	.contact-bar {
		display: flex; justify-content: space-between; align-items: center;
		flex-wrap: wrap; gap: 0.75rem;
		padding: 1rem 0; margin-bottom: 1rem;
		border-top: 1px solid rgba(245,240,232,0.06);
	}
	.contact-info { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
	.contact-email {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem; color: rgba(245,240,232,0.5);
	}
	.contact-loc {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 0.75rem; color: rgba(245,240,232,0.3);
	}
	.social-links { display: flex; gap: 0.5rem; }
	.social-link {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem; letter-spacing: 0.06em; text-transform: capitalize;
		color: rgba(245,240,232,0.4); text-decoration: none;
		border: 1px solid rgba(245,240,232,0.08);
		padding: 0.25rem 0.6rem; border-radius: 4px;
		transition: all 0.2s ease;
	}
	.social-link:hover {
		color: #f5f0e8; border-color: rgba(206,17,38,0.35);
		background: rgba(206,17,38,0.06);
	}

	/* Stats strip */
	.stats-strip {
		display: flex; justify-content: center; align-items: center;
		gap: 0.75rem; padding: 1.5rem 0 2rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.55rem; letter-spacing: 0.2em;
		color: rgba(245,240,232,0.2); text-transform: uppercase;
	}
	.stats-dot { color: rgba(206,17,38,0.4); font-size: 0.8rem; }

	/* Events */
	.events-blend { margin-top: 0.5rem; }

	/* ---- FOOTER ---- */
	.site-footer {
		position: relative; z-index: 2;
		text-align: center; padding: 2rem 1rem 2.5rem;
	}
	.site-footer p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem; letter-spacing: 0.2em;
		color: rgba(245,240,232,0.25); text-transform: uppercase;
	}
	.sep { color: rgba(206,17,38,0.5); margin: 0 0.3rem; }

	@keyframes glow-breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

	/* ---- MOBILE ---- */
	@media (max-width: 768px) {
		.site-header { padding: 1.25rem 0.75rem 0; }
		.top-bar { margin-bottom: 1.25rem; }
		.logo-uic { font-size: 2rem; }
		.logo-spacetime { font-size: 1.15rem; }
		.sps-title { font-size: 0.85rem; }
		.club-nav { grid-template-columns: 1fr; gap: 0.75rem; }
		.portal-card { height: 180px; }
		.portal-label { font-size: 1.1rem; }
		.hero-tagline p { font-size: 1.1rem; }
		.hero-tagline { padding-top: 2rem; }
		.hero-divider { margin-top: 1.5rem; }
		.main-content { padding: 1.5rem 0.75rem 1.5rem; }
		.sps-heading { font-size: 1.5rem; }
		.two-col { grid-template-columns: 1fr; }
		.officers-grid { grid-template-columns: repeat(2, 1fr); }
		.contact-bar { flex-direction: column; align-items: flex-start; }
		.stats-strip { flex-wrap: wrap; gap: 0.4rem; font-size: 0.5rem; }
		.login-link { font-size: 0.55rem; padding: 0.35rem 0.75rem; white-space: nowrap; }
	}

	@media (prefers-reduced-motion: reduce) {
		.site-header, .main-content { opacity: 1; transform: none; transition: none; }
		.logo-glow { animation: none; opacity: 0.5; }
		.portal-card { transition: none; }
		.portal-edge, .portal-hint { transition: none; }
		.pulse-astro, .pulse-phys { animation: none; }
	}
</style>
