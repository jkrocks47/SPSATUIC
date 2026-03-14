<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>About | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Who we are'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'About SPS'}
			</h1>
			<p class="font-body text-lg text-physics-dark/50 mt-3">{data.content['page-description'] ?? 'Society of Physics Students at UIC'}</p>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<!-- About Text -->
		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 mb-8">
			<h2 class="font-display text-2xl font-bold text-physics-dark mb-4">Our Mission</h2>
			{#if data.clubInfo?.aboutText}
				<p class="font-body text-base text-physics-dark/60 leading-relaxed whitespace-pre-wrap">
					{data.clubInfo.aboutText}
				</p>
			{:else}
				<p class="font-body text-base text-physics-dark/60 leading-relaxed">
					The Society of Physics Students at UIC is a national organization of physics students
					dedicated to the advancement of physics education, research, and outreach. Our chapter
					provides a welcoming environment for students of all backgrounds to explore their
					passion for physics through events, research presentations, lab tours, and collaborative
					study sessions.
				</p>
			{/if}
		</div>

		<!-- Meeting Info -->
		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 mb-8">
			<h2 class="font-display text-2xl font-bold text-physics-dark mb-4">Meetings</h2>
			{#if data.clubInfo?.meetingInfo}
				<p class="font-body text-base text-physics-dark/60 leading-relaxed whitespace-pre-wrap">
					{data.clubInfo.meetingInfo}
				</p>
			{:else}
				<p class="font-body text-base text-physics-dark/60 leading-relaxed">
					We meet biweekly during the fall and spring semesters. Meetings typically feature guest
					speakers, research presentations from members, or collaborative problem-solving sessions.
					All UIC students are welcome.
				</p>
			{/if}
		</div>

		<!-- Officers -->
		{#if data.officers.length > 0}
			<div class="mb-8">
				<h2 class="font-display text-2xl font-bold text-physics-dark mb-8">Officers</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each data.officers as officer}
						<div class="bg-white rounded-2xl border border-gray-100 p-6 text-center">
							{#if officer.imageUrl}
								<img
									src={officer.imageUrl}
									alt={officer.name}
									class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
								/>
							{:else}
								<div class="w-20 h-20 rounded-full mx-auto mb-4 bg-physics-blue/10 flex items-center justify-center">
									<span class="font-display text-xl text-physics-blue/50">
										{officer.name.charAt(0)}
									</span>
								</div>
							{/if}
							<h3 class="font-display text-lg font-bold text-physics-dark">{officer.name}</h3>
							<p class="font-body text-sm text-physics-blue mt-1">{officer.position}</p>
							{#if officer.bio}
								<p class="font-body text-sm text-physics-dark/50 mt-3">{officer.bio}</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- History -->
		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12">
			<h2 class="font-display text-2xl font-bold text-physics-dark mb-4">History</h2>
			<p class="font-body text-base text-physics-dark/60 leading-relaxed">
				{data.content['history-body'] ?? 'Our chapter of the Society of Physics Students has been active at UIC for decades, fostering a community of curious minds and future physicists. We have hosted distinguished speakers, organized trips to national laboratories like Fermilab and Argonne, and supported students in their academic and research pursuits. Our alumni have gone on to careers in academia, industry, and beyond.'}
			</p>
		</div>
	</div>
</section>
