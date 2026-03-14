<script lang="ts">
	import { formatDate } from '$lib/utils/dates';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Schedule'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'Events'}
			</h1>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<!-- Upcoming Events -->
		{#if data.upcomingEvents.length === 0}
			<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p class="font-body text-sm text-physics-dark/40">No upcoming events. Check back soon.</p>
			</div>
		{:else}
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-4">Upcoming</p>
			<div class="flex flex-col gap-4">
				{#each data.upcomingEvents as event}
					<a href="/physics/events/{event.id}" class="no-underline block">
						<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-physics-blue/20 transition-all duration-300">
							<div class="flex flex-col sm:flex-row">
								{#if event.imageUrl}
									<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
										<img
											src={event.imageUrl}
											alt={event.title}
											class="w-full h-full object-cover"
										/>
									</div>
								{/if}
								<div class="p-6 flex-1">
									<p class="font-body text-xs text-physics-blue font-medium mb-2">
										{formatDate(event.date)}
										{#if event.time}
											<span class="text-physics-dark/30 mx-1">/</span>
											{event.time}
										{/if}
									</p>
									<h2 class="font-display text-xl font-bold text-physics-dark mb-2">
										{event.title}
									</h2>
									{#if event.location}
										<p class="font-body text-sm text-physics-dark/50 mb-3">{event.location}</p>
									{/if}
									{#if event.description}
										<p class="font-body text-sm text-physics-dark/60 line-clamp-2">{event.description}</p>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}

		<!-- Past Events -->
		{#if data.pastEvents.length > 0}
			<div class="mt-16 mb-4">
				<div class="w-16 h-0.5 bg-physics-blue/15 mb-8"></div>
				<p class="font-body text-sm tracking-widest text-physics-dark/30 uppercase">Past Events</p>
			</div>
			<div class="flex flex-col gap-4">
				{#each data.pastEvents as event}
					<a href="/physics/events/{event.id}" class="no-underline block opacity-50 hover:opacity-70 transition-opacity">
						<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-physics-blue/20 transition-all duration-300">
							<div class="flex flex-col sm:flex-row">
								{#if event.imageUrl}
									<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
										<img
											src={event.imageUrl}
											alt={event.title}
											class="w-full h-full object-cover grayscale"
										/>
									</div>
								{/if}
								<div class="p-6 flex-1">
									<div class="flex items-start justify-between gap-4 mb-2">
										<p class="font-body text-xs text-physics-blue font-medium">
											{formatDate(event.date)}
											{#if event.time}
												<span class="text-physics-dark/30 mx-1">/</span>
												{event.time}
											{/if}
										</p>
										<span class="inline-block flex-shrink-0 font-body text-[10px] tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 uppercase">
											Past Event
										</span>
									</div>
									<h2 class="font-display text-xl font-bold text-physics-dark mb-2">
										{event.title}
									</h2>
									{#if event.location}
										<p class="font-body text-sm text-physics-dark/50 mb-3">{event.location}</p>
									{/if}
									{#if event.description}
										<p class="font-body text-sm text-physics-dark/60 line-clamp-2">{event.description}</p>
									{/if}
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
