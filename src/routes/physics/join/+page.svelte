<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Join | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Get involved'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'Join SPS'}
			</h1>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<!-- Benefits -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
			{#each [
				{ num: '1', title: data.content['benefit-1-title'] ?? 'Research Opportunities', desc: data.content['benefit-1-body'] ?? 'Present your own research and learn about ongoing projects from peers and faculty.' },
				{ num: '2', title: data.content['benefit-2-title'] ?? 'Lab Tours', desc: data.content['benefit-2-body'] ?? 'Visit national labs like Fermilab and Argonne, and explore cutting-edge facilities.' },
				{ num: '3', title: data.content['benefit-3-title'] ?? 'Study Groups', desc: data.content['benefit-3-body'] ?? 'Collaborative study sessions and tutoring for physics courses at all levels.' },
				{ num: '4', title: data.content['benefit-4-title'] ?? 'Networking', desc: data.content['benefit-4-body'] ?? 'Connect with faculty, alumni, and professionals through our events and national SPS network.' }
			] as benefit}
				<div class="bg-white rounded-2xl border border-gray-100 p-6">
					<div class="w-10 h-10 rounded-full bg-physics-blue/10 flex items-center justify-center mb-4">
						<span class="text-physics-blue font-bold">{benefit.num}</span>
					</div>
					<h3 class="font-display text-lg font-bold text-physics-dark mb-2">{benefit.title}</h3>
					<p class="font-body text-sm text-physics-dark/60">
						{benefit.desc}
					</p>
				</div>
			{/each}
		</div>

		<!-- CTA -->
		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center">
			<h2 class="font-display text-2xl font-bold text-physics-dark mb-4">{data.content['cta-title'] ?? 'Ready to join?'}</h2>
			<p class="font-body text-base text-physics-dark/60 mb-8 max-w-lg mx-auto">
				{data.content['cta-body'] ?? 'SPS is open to all UIC students with an interest in physics, regardless of major. Come to a meeting or reach out to learn more.'}
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/physics/events"
					class="inline-flex items-center justify-center px-8 py-3 bg-physics-blue text-white font-body text-sm font-medium rounded-full hover:bg-physics-blue/90 transition-colors no-underline"
				>
					View Events
				</a>
				<a
					href="/physics/contact"
					class="inline-flex items-center justify-center px-8 py-3 border border-physics-dark/20 text-physics-dark font-body text-sm font-medium rounded-full hover:border-physics-blue hover:text-physics-blue transition-colors no-underline"
				>
					Contact Us
				</a>
			</div>
		</div>
	</div>
</section>
