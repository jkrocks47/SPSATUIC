<script lang="ts">
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';

	let { data } = $props();
	let selectedImage = $state<typeof data.images[0] | null>(null);

	function formatCoord(image: typeof data.images[0]): string | null {
		if (image.raCoord && image.decCoord) return `RA ${image.raCoord}, Dec ${image.decCoord}`;
		if (image.raCoord) return `RA ${image.raCoord}`;
		if (image.decCoord) return `Dec ${image.decCoord}`;
		return null;
	}

	function formatSensor(image: typeof data.images[0]): string | null {
		const parts = [];
		if (image.iso) parts.push(`ISO ${image.iso}`);
		if (image.aperture) parts.push(image.aperture);
		return parts.length > 0 ? parts.join(' / ') : null;
	}

	function openModal(image: typeof data.images[0]) {
		selectedImage = image;
	}

	function closeModal() {
		selectedImage = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedImage) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Deep Field Gallery | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">{data.content['page-subtitle'] ?? 'ARCHIVE'}</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				{data.content['page-title'] ?? 'DEEP FIELD GALLERY'}
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- Masonry Grid -->
		{#if data.images.length === 0}
			<GlassPanel class="p-12 text-center">
				<p class="font-mono text-sm tracking-[0.15em] text-astro-cream/50">
					No images yet. Check back soon.
				</p>
			</GlassPanel>
		{:else}
			<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
				{#each data.images as image}
					<button
						class="w-full break-inside-avoid cursor-pointer bg-transparent border-0 p-0 text-left"
						onclick={() => openModal(image)}
					>
						<div class="scan-effect rounded-xl overflow-hidden group">
							<img
								src={image.thumbnailUrl || image.url}
								alt={image.caption || 'Gallery image'}
								class="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-cosmos-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
								{#if image.caption}
									<p class="font-mono text-xs text-astro-cream/90">{image.caption}</p>
								{/if}
							</div>
						</div>
						{#if image.photographer}
							<p class="font-mono text-[10px] tracking-[0.15em] text-astro-cream/30 mt-2 px-1">
								{image.photographer}
							</p>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Lightbox Modal -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 bg-cosmos-black/95 backdrop-blur-sm flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer"
			onclick={closeModal}
			aria-label="Close modal"
		></button>

		<div class="relative z-10 max-w-5xl max-h-[90vh] flex flex-col items-center">
			<button
				class="absolute -top-10 right-0 font-mono text-xs tracking-[0.2em] text-astro-cream/50 hover:text-astro-cream transition-colors bg-transparent border-0 cursor-pointer"
				onclick={closeModal}
			>
				CLOSE &times;
			</button>

			<div class="relative">
				<img
					src={selectedImage.url}
					alt={selectedImage.caption || 'Gallery image'}
					class="max-w-full max-h-[75vh] object-contain rounded-lg"
				/>

				<!-- HUD corner brackets -->
				<div class="absolute top-3 left-3 w-6 h-6 border-l border-t border-[#22d3ee]/40"></div>
				<div class="absolute top-3 right-3 w-6 h-6 border-r border-t border-[#22d3ee]/40"></div>
				<div class="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-[#22d3ee]/40"></div>
				<div class="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-[#22d3ee]/40"></div>
			</div>

			<div class="mt-4 text-center">
				{#if selectedImage.caption}
					<p class="font-body text-sm text-astro-cream/80">{selectedImage.caption}</p>
				{/if}
				{#if selectedImage.photographer}
					<p class="font-mono text-[10px] tracking-[0.15em] text-astro-cream/40 mt-1">
						Photo by {selectedImage.photographer}
					</p>
				{/if}
			</div>

			<!-- Observation metadata -->
			{#if formatCoord(selectedImage) || selectedImage.exposureTime || selectedImage.equipment || formatSensor(selectedImage) || selectedImage.observationDate}
				<div class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 max-w-lg">
					{#if formatCoord(selectedImage)}
						<div class="col-span-2 flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">COORD</span>
							<span class="font-mono text-xs text-[#22d3ee]">{formatCoord(selectedImage)}</span>
						</div>
					{/if}
					{#if selectedImage.exposureTime}
						<div class="flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">EXP</span>
							<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.exposureTime}</span>
						</div>
					{/if}
					{#if selectedImage.equipment}
						<div class="flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">EQUIP</span>
							<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.equipment}</span>
						</div>
					{/if}
					{#if formatSensor(selectedImage)}
						<div class="flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">SENSOR</span>
							<span class="font-mono text-xs text-[#22d3ee]">{formatSensor(selectedImage)}</span>
						</div>
					{/if}
					{#if selectedImage.observationDate}
						<div class="flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">DATE</span>
							<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.observationDate}</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
