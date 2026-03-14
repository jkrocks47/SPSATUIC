<script lang="ts">
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Board | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">{data.content['page-subtitle'] ?? 'OUR TEAM'}</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				{data.content['page-title'] ?? 'BOARD'}
			</h1>
			<p class="font-body text-lg text-astro-cream/50 mt-4">{data.content['page-description'] ?? 'Meet the people behind the club'}</p>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		{#if data.boardMembers.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.boardMembers as member}
					{@const image = member.memberProfileImage || member.imageUrl}
					{@const displayName = member.memberId ? `${member.memberFirstName} ${member.memberLastName}` : member.name}
					<GlassPanel class="p-6 text-center">
						{#if image}
							<img
								src={image}
								alt={displayName}
								class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-astro-indigo/30"
							/>
						{:else}
							<div class="w-24 h-24 rounded-full mx-auto mb-4 bg-astro-indigo/20 flex items-center justify-center">
								<span class="font-display text-2xl text-astro-indigo/60">
									{displayName.charAt(0)}
								</span>
							</div>
						{/if}
						<h3 class="font-display text-lg font-bold text-astro-cream">{displayName}</h3>
						<p class="font-mono text-xs tracking-[0.15em] text-astro-indigo/80 mt-1">{member.position}</p>
						{#if member.memberYear || member.memberMajor}
							<p class="font-body text-xs text-astro-cream/40 mt-2">
								{[member.memberYear, member.memberMajor].filter(Boolean).join(' · ')}
							</p>
						{/if}
						{#if member.bio}
							<p class="font-body text-sm text-astro-cream/50 mt-3">{member.bio}</p>
						{/if}
						{#if member.email}
							<a
								href="mailto:{member.email}"
								class="inline-block font-mono text-xs text-astro-indigo/70 hover:text-astro-indigo mt-3 transition-colors no-underline"
							>
								{member.email}
							</a>
						{/if}
					</GlassPanel>
				{/each}
			</div>
		{:else}
			<GlassPanel class="p-12 text-center">
				<p class="font-body text-astro-cream/50">Board members will be announced soon.</p>
			</GlassPanel>
		{/if}
	</div>
</section>
