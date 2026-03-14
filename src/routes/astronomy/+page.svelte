<script lang="ts">
	import HeroSection from '$lib/components/astronomy/HeroSection.svelte';
	import HorizonsTimeline from '$lib/components/astronomy/HorizonsTimeline.svelte';
	import DeepFieldGallery from '$lib/components/astronomy/DeepFieldGallery.svelte';
	import AnnouncementBanner from '$lib/components/shared/AnnouncementBanner.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Astronomy | UICSpacetime</title>
</svelte:head>

<HeroSection
	heroTitle={data.content['hero-title']}
	heroSubtitle={data.content['hero-subtitle']}
	heroCta={data.content['hero-cta']}
/>

{#if data.announcements && data.announcements.length > 0}
	<div class="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-8">
		<AnnouncementBanner announcements={data.announcements} theme="dark" />
	</div>
{/if}

<HorizonsTimeline events={data.upcomingEvents} />

<DeepFieldGallery images={data.galleryImages} />
