<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Board | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-5xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Our team'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'Board'}
			</h1>
			<p class="font-body text-lg text-physics-dark/50 mt-3">{data.content['page-description'] ?? 'Meet the people behind the club'}</p>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		{#if data.boardMembers.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.boardMembers as member}
					{@const image = member.memberProfileImage || member.imageUrl}
					{@const displayName = member.memberId ? `${member.memberFirstName} ${member.memberLastName}` : member.name}
					<div class="bg-white rounded-2xl border border-gray-100 p-6 text-center">
						{#if image}
							<img
								src={image}
								alt={displayName}
								class="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
							/>
						{:else}
							<div class="w-20 h-20 rounded-full mx-auto mb-4 bg-physics-blue/10 flex items-center justify-center">
								<span class="font-display text-xl text-physics-blue/50">
									{displayName.charAt(0)}
								</span>
							</div>
						{/if}
						<h3 class="font-display text-lg font-bold text-physics-dark">{displayName}</h3>
						<p class="font-body text-sm text-physics-blue mt-1">{member.position}</p>
						{#if member.memberYear || member.memberMajor}
							<p class="font-body text-xs text-physics-dark/40 mt-2">
								{[member.memberYear, member.memberMajor].filter(Boolean).join(' · ')}
							</p>
						{/if}
						{#if member.bio}
							<p class="font-body text-sm text-physics-dark/50 mt-3">{member.bio}</p>
						{/if}
						{#if member.email}
							<a
								href="mailto:{member.email}"
								class="inline-block font-body text-xs text-physics-blue/70 hover:text-physics-blue mt-3 transition-colors no-underline"
							>
								{member.email}
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p class="font-body text-physics-dark/50">Board members will be announced soon.</p>
			</div>
		{/if}
	</div>
</section>
