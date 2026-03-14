<script lang="ts">
	import PhysicsHero from '$lib/components/physics/PhysicsHero.svelte';
	import AnnouncementBanner from '$lib/components/shared/AnnouncementBanner.svelte';
	import { formatDate } from '$lib/utils/dates';

	let { data } = $props();
</script>

<svelte:head>
	<title>Society of Physics Students | UIC</title>
</svelte:head>

<PhysicsHero
	heroTitle={data.content['hero-title']}
	heroSubtitle={data.content['hero-subtitle']}
	heroCta={data.content['hero-cta']}
/>

{#if data.announcements && data.announcements.length > 0}
	<div class="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-8">
		<AnnouncementBanner announcements={data.announcements} theme="light" />
	</div>
{/if}

<!-- Events Preview -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<div class="flex items-end justify-between mb-10">
			<div>
				<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['events-subtitle'] ?? "What's happening"}</p>
				<h2 class="font-display text-3xl sm:text-4xl font-bold text-physics-dark">{data.content['events-title'] ?? 'Upcoming Events'}</h2>
			</div>
			<a
				href="/physics/events"
				class="hidden sm:inline-flex font-body text-sm text-physics-blue hover:text-physics-blue/80 transition-colors no-underline"
			>
				View all &rarr;
			</a>
		</div>

		{#if data.events.length === 0}
			<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p class="font-body text-sm text-physics-dark/40">No upcoming events. Check back soon.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.events as event}
					<a href="/physics/events" class="no-underline group">
						<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-physics-blue/20 transition-all duration-300">
							{#if event.imageUrl}
								<div class="h-48 overflow-hidden">
									<img
										src={event.imageUrl}
										alt={event.title}
										class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
							{:else}
								<div class="h-48 bg-gradient-to-br from-physics-blue/5 to-physics-blue/10 flex items-center justify-center">
									<span class="font-display text-4xl text-physics-blue/20">SPS</span>
								</div>
							{/if}
							<div class="p-5">
								<p class="font-body text-xs text-physics-blue font-medium mb-2">
									{formatDate(event.date)}
								</p>
								<h3 class="font-display text-lg font-bold text-physics-dark group-hover:text-physics-blue transition-colors">
									{event.title}
								</h3>
								{#if event.location}
									<p class="font-body text-sm text-physics-dark/50 mt-2">{event.location}</p>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<div class="sm:hidden mt-6 text-center">
			<a href="/physics/events" class="font-body text-sm text-physics-blue no-underline">View all events &rarr;</a>
		</div>
	</div>
</section>

<!-- Gallery Preview -->
{#if data.images.length > 0}
	<section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
		<div class="max-w-7xl mx-auto">
			<div class="flex items-end justify-between mb-10">
				<div>
					<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['gallery-subtitle'] ?? 'Visual archive'}</p>
					<h2 class="font-display text-3xl sm:text-4xl font-bold text-physics-dark">{data.content['gallery-title'] ?? 'Gallery'}</h2>
				</div>
				<a
					href="/physics/gallery"
					class="hidden sm:inline-flex font-body text-sm text-physics-blue hover:text-physics-blue/80 transition-colors no-underline"
				>
					View all &rarr;
				</a>
			</div>

			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.images as image}
					<div class="rounded-xl overflow-hidden group">
						<img
							src={image.url}
							alt={image.caption || 'Gallery image'}
							class="w-full h-48 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy"
						/>
					</div>
				{/each}
			</div>

			<div class="sm:hidden mt-6 text-center">
				<a href="/physics/gallery" class="font-body text-sm text-physics-blue no-underline">View full gallery &rarr;</a>
			</div>
		</div>
	</section>
{/if}

<!-- About Preview -->
<section class="py-20 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto text-center">
		<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['about-subtitle'] ?? 'About us'}</p>
		<h2 class="font-display text-3xl sm:text-4xl font-bold text-physics-dark mb-6">{data.content['about-title'] ?? 'Who We Are'}</h2>
		<p class="font-body text-lg text-physics-dark/60 leading-relaxed max-w-2xl mx-auto">
			{data.content['about-body'] ?? 'The Society of Physics Students at UIC is a professional organization that aims to foster a love of physics among students. We host research talks, lab tours, study sessions, and social events throughout the academic year.'}
		</p>
		<a
			href="/physics/about"
			class="inline-flex items-center px-8 py-3 mt-8 border border-physics-dark/20 text-physics-dark font-body text-sm font-medium rounded-full hover:border-physics-blue hover:text-physics-blue transition-colors no-underline"
		>
			Learn more about SPS
		</a>
	</div>
</section>
