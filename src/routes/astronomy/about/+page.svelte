<script lang="ts">
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>About | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">{data.content['page-subtitle'] ?? 'WHO WE ARE'}</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				{data.content['page-title'] ?? 'ABOUT'}
			</h1>
			<p class="font-body text-lg text-astro-cream/50 mt-4">{data.content['page-description'] ?? 'UIC Astronomy Club'}</p>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- About Text -->
		<GlassPanel class="p-8 sm:p-12 mb-12">
			<h2 class="font-display text-2xl font-bold text-astro-cream mb-6">Our Mission</h2>
			{#if data.clubInfo?.aboutText}
				<p class="font-body text-base text-astro-cream/70 leading-relaxed whitespace-pre-wrap">
					{data.clubInfo.aboutText}
				</p>
			{:else}
				<p class="font-body text-base text-astro-cream/70 leading-relaxed">
					The UIC Astronomy Club is a student-run organization dedicated to exploring the cosmos
					and fostering a passion for astronomy among students at the University of Illinois at
					Chicago. Whether you are a seasoned stargazer or simply curious about the night sky,
					our club offers observing sessions, guest lectures, workshops, and outreach events that
					bring the universe a little closer to home.
				</p>
			{/if}
		</GlassPanel>

		<!-- Meeting Info -->
		<GlassPanel class="p-8 sm:p-12 mb-12">
			<h2 class="font-display text-2xl font-bold text-astro-cream mb-6">Meetings</h2>
			{#if data.clubInfo?.meetingInfo}
				<p class="font-body text-base text-astro-cream/70 leading-relaxed whitespace-pre-wrap">
					{data.clubInfo.meetingInfo}
				</p>
			{:else}
				<p class="font-body text-base text-astro-cream/70 leading-relaxed">
					We meet weekly during the fall and spring semesters. Check our events page for the latest
					schedule and meeting locations. All students are welcome, regardless of major or experience
					level.
				</p>
			{/if}
		</GlassPanel>

		<!-- Officers -->
		{#if data.officers.length > 0}
			<div class="mb-12">
				<h2 class="font-display text-2xl font-bold text-astro-cream mb-8 text-center">Officers</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each data.officers as officer}
						<GlassPanel class="p-6 text-center">
							{#if officer.imageUrl}
								<img
									src={officer.imageUrl}
									alt={officer.name}
									class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-astro-indigo/30"
								/>
							{:else}
								<div class="w-24 h-24 rounded-full mx-auto mb-4 bg-astro-indigo/20 flex items-center justify-center">
									<span class="font-display text-2xl text-astro-indigo/60">
										{officer.name.charAt(0)}
									</span>
								</div>
							{/if}
							<h3 class="font-display text-lg font-bold text-astro-cream">{officer.name}</h3>
							<p class="font-mono text-xs tracking-[0.15em] text-astro-indigo/80 mt-1">{officer.position}</p>
							{#if officer.bio}
								<p class="font-body text-sm text-astro-cream/50 mt-3">{officer.bio}</p>
							{/if}
						</GlassPanel>
					{/each}
				</div>
			</div>
		{/if}

		<!-- History -->
		<GlassPanel class="p-8 sm:p-12">
			<h2 class="font-display text-2xl font-bold text-astro-cream mb-6">History</h2>
			<p class="font-body text-base text-astro-cream/70 leading-relaxed">
				{data.content['history-body'] ?? 'Founded by a small group of passionate students, the UIC Astronomy Club has grown into one of the most active science organizations on campus. Over the years, we have hosted star parties, partnered with the Adler Planetarium, and participated in national astronomy events. Our community continues to grow as we inspire the next generation of astronomers and space enthusiasts.'}
			</p>
		</GlassPanel>
	</div>
</section>
