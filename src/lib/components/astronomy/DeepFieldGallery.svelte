<script lang="ts">
	import HUDOverlay from '$lib/components/astronomy/HUDOverlay.svelte';
	import ScrollReveal from '$lib/components/astronomy/ScrollReveal.svelte';

	interface GalleryImage {
		id: string;
		url: string;
		thumbnailUrl?: string | null;
		caption: string | null;
		photographer: string | null;
		width?: number | null;
		height?: number | null;
		raCoord?: string | null;
		decCoord?: string | null;
		exposureTime?: string | null;
		equipment?: string | null;
		iso?: string | null;
		aperture?: string | null;
		observationDate?: string | null;
	}

	interface Props {
		images: GalleryImage[];
	}

	let { images }: Props = $props();

	let scrollContainer: HTMLDivElement | undefined = $state();
	let selectedImage = $state<GalleryImage | null>(null);

	const REDACTED = '[REDACTED]';

	function formatCoord(image: GalleryImage): string {
		if (image.raCoord && image.decCoord) return `RA ${image.raCoord}, Dec ${image.decCoord}`;
		if (image.raCoord) return `RA ${image.raCoord}`;
		if (image.decCoord) return `Dec ${image.decCoord}`;
		return REDACTED;
	}

	function formatSensor(image: GalleryImage): string {
		const parts = [];
		if (image.iso) parts.push(`ISO ${image.iso}`);
		if (image.aperture) parts.push(image.aperture);
		return parts.length > 0 ? parts.join(' / ') : REDACTED;
	}

	function scrollBy(direction: number) {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: direction * 340, behavior: 'smooth' });
	}

	function openLightbox(image: GalleryImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') closeLightbox(); }} />

<section class="relative bg-cosmos-black py-20 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Section title — left-aligned, brutalist with HUD bracket accent -->
		<div class="mb-10 relative">
			<h2 class="font-display font-bold text-astro-cream text-2xl md:text-3xl uppercase tracking-[0.12em] relative inline-block">
				<span class="absolute -left-4 top-0 w-3 h-3 border-l border-t border-astro-cream/15"></span>
				Deep Field Gallery
			</h2>
			<div class="mt-3 h-px w-20 bg-astro-cream/15"></div>
		</div>

		{#if images.length === 0}
			<!-- Placeholder: square polaroid snapshots -->
			<div class="relative">
				<div class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide py-4" bind:this={scrollContainer}>
					{#each Array(4) as _, i}
						<ScrollReveal delay={i * 80}>
							<div
								class="flex-shrink-0 w-72 md:w-80 snap-center deep-field-frame"
							>
								<div
									class="w-full aspect-square flex items-center justify-center"
									style="background: linear-gradient({30 + i * 25}deg, rgba(232,93,38,0.15), rgba(168,85,247,0.1), rgba(10,10,15,0.9));"
								>
									<span class="font-mono text-[10px] text-white/20 tracking-wider uppercase text-center px-4">
										Gallery images coming soon
									</span>
								</div>
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Square polaroid snapshots of the infinite -->
			<div class="relative">
				<!-- Scroll arrows -->
				<button
					class="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-cosmos-black/80 to-transparent hidden md:flex items-center justify-start pl-2 text-astro-cream/40 hover:text-astro-cream transition-colors"
					onclick={() => scrollBy(-1)}
					aria-label="Scroll left"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M13 4L7 10L13 16" />
					</svg>
				</button>
				<button
					class="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-cosmos-black/80 to-transparent hidden md:flex items-center justify-end pr-2 text-astro-cream/40 hover:text-astro-cream transition-colors"
					onclick={() => scrollBy(1)}
					aria-label="Scroll right"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M7 4L13 10L7 16" />
					</svg>
				</button>

				<div class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide py-4" bind:this={scrollContainer}>
					{#each images as image, i}
						<ScrollReveal delay={i * 60}>
							<div
								class="relative group flex-shrink-0 w-72 md:w-80 snap-center cursor-pointer"
								onclick={() => openLightbox(image)}
								onkeydown={(e) => e.key === 'Enter' && openLightbox(image)}
								role="button"
								tabindex="0"
							>
								{#if i === 0}
									<!-- Featured image: permanent monospaced data block overlay -->
									<div class="relative overflow-hidden deep-field-frame">
										<img
											src={image.thumbnailUrl || image.url}
											alt={image.caption || 'Deep field photograph'}
											class="w-full aspect-square object-cover deep-field-img"
											loading="lazy"
										/>

										<!-- Stark monospaced data block — real observation data -->
										<div class="absolute bottom-0 left-0 right-0 bg-black/60 p-3 pointer-events-none">
											<div class="space-y-1">
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">COORD</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{formatCoord(image)}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">EXP</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{image.exposureTime || REDACTED}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">EQUIP</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{image.equipment || REDACTED}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">DATE</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{image.observationDate || REDACTED}</span>
												</div>
											</div>
										</div>

										<!-- Corner brackets -->
										<div class="absolute top-2 left-2 w-4 h-4 border-l border-t border-white/20"></div>
										<div class="absolute top-2 right-2 w-4 h-4 border-r border-t border-white/20"></div>
										<div class="absolute bottom-[90px] left-2 w-4 h-4 border-l border-b border-white/20"></div>
										<div class="absolute bottom-[90px] right-2 w-4 h-4 border-r border-b border-white/20"></div>
									</div>
								{:else}
									<!-- Standard deep field window -->
									<div class="relative overflow-hidden deep-field-frame">
										<img
											src={image.thumbnailUrl || image.url}
											alt={image.caption || 'Deep field photograph'}
											class="w-full aspect-square object-cover deep-field-img transition-transform duration-500 ease-out group-hover:scale-105"
											loading="lazy"
										/>

										<!-- HUD overlay on hover -->
										<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out">
											<HUDOverlay
												coordinate={formatCoord(image)}
												exposureTime={image.exposureTime || REDACTED}
												equipment={image.equipment || REDACTED}
												date={image.observationDate || REDACTED}
											/>
										</div>
									</div>
								{/if}
							</div>
						</ScrollReveal>
					{/each}
				</div>
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
			onclick={closeLightbox}
			aria-label="Close lightbox"
		></button>

		<div class="relative z-10 max-w-5xl max-h-[90vh] flex flex-col items-center">
			<button
				class="absolute -top-10 right-0 font-mono text-xs tracking-[0.2em] text-astro-cream/50 hover:text-astro-cream transition-colors bg-transparent border-0 cursor-pointer"
				onclick={closeLightbox}
			>
				CLOSE &times;
			</button>

			<div class="relative">
				<img
					src={selectedImage.url}
					alt={selectedImage.caption || 'Deep field photograph'}
					class="max-w-full max-h-[75vh] object-contain rounded-lg"
				/>

				<!-- HUD corner brackets on the full-res image -->
				<div class="absolute top-3 left-3 w-6 h-6 border-l border-t border-[#22d3ee]/40"></div>
				<div class="absolute top-3 right-3 w-6 h-6 border-r border-t border-[#22d3ee]/40"></div>
				<div class="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-[#22d3ee]/40"></div>
				<div class="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-[#22d3ee]/40"></div>
			</div>

			<!-- Metadata panel below image -->
			<div class="mt-4 w-full max-w-lg">
				{#if selectedImage.caption}
					<p class="font-body text-sm text-astro-cream/80 text-center mb-3">{selectedImage.caption}</p>
				{/if}

				<div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
					<div class="col-span-2 flex items-center gap-2">
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">COORD</span>
						<span class="font-mono text-xs text-[#22d3ee]">{formatCoord(selectedImage)}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">EXP</span>
						<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.exposureTime || REDACTED}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">EQUIP</span>
						<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.equipment || REDACTED}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">SENSOR</span>
						<span class="font-mono text-xs text-[#22d3ee]">{formatSensor(selectedImage)}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">DATE</span>
						<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.observationDate || REDACTED}</span>
					</div>
					{#if selectedImage.photographer}
						<div class="col-span-2 flex items-center gap-2">
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-cyan-400/50">PHOTO</span>
							<span class="font-mono text-xs text-[#22d3ee]">{selectedImage.photographer}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Square polaroid frames — windows into the infinite */
	.deep-field-frame {
		border: 2px solid rgba(255,255,255,0.06);
		transition: border-color 0.4s ease, box-shadow 0.4s ease;
	}

	.deep-field-frame:hover {
		border-color: rgba(232, 93, 38, 0.4);
		box-shadow:
			0 0 20px rgba(232, 93, 38, 0.25),
			0 0 40px rgba(232, 93, 38, 0.08);
	}

	/* Full vivid color — burning ambers, searing magentas, cold bright pinpricks */
	.deep-field-img {
		filter: contrast(1.15) saturate(1.2);
	}

	/* Scrollbar hiding */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.deep-field-img {
			transition: none;
		}

		.deep-field-frame {
			transition: none;
		}
	}
</style>
