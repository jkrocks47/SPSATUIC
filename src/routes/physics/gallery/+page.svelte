<script lang="ts">
	let { data } = $props();
	let selectedImage = $state<typeof data.images[0] | null>(null);

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
	<title>Gallery | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Visual archive'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'Gallery'}
			</h1>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<!-- Grid -->
		{#if data.images.length === 0}
			<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p class="font-body text-sm text-physics-dark/40">No images yet. Check back soon.</p>
			</div>
		{:else}
			<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
				{#each data.images as image}
					<button
						class="w-full break-inside-avoid cursor-pointer bg-transparent border-0 p-0 text-left"
						onclick={() => openModal(image)}
					>
						<div class="rounded-xl overflow-hidden group relative">
							<img
								src={image.thumbnailUrl || image.url}
								alt={image.caption || 'Gallery image'}
								class="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-physics-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 rounded-xl">
								{#if image.caption}
									<p class="font-body text-sm text-white">{image.caption}</p>
								{/if}
							</div>
						</div>
						{#if image.photographer}
							<p class="font-body text-xs text-physics-dark/30 mt-2 px-1">
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
		class="fixed inset-0 z-50 bg-physics-dark/95 backdrop-blur-sm flex items-center justify-center p-4"
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
				class="absolute -top-10 right-0 font-body text-sm text-white/50 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
				onclick={closeModal}
			>
				Close
			</button>

			<img
				src={selectedImage.url}
				alt={selectedImage.caption || 'Gallery image'}
				class="max-w-full max-h-[80vh] object-contain rounded-lg"
			/>

			<div class="mt-4 text-center">
				{#if selectedImage.caption}
					<p class="font-body text-sm text-white/80">{selectedImage.caption}</p>
				{/if}
				{#if selectedImage.photographer}
					<p class="font-body text-xs text-white/40 mt-1">
						Photo by {selectedImage.photographer}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
