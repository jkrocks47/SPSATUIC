<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		slug: string;
		clubType: string | null;
		placeholderLabel?: string;
		hasDescription?: boolean;
	}

	let {
		content,
		slug,
		clubType,
		placeholderLabel = 'Content appears here',
		hasDescription = false
	}: Props = $props();

	const isAstro = clubType === 'astronomy';
</script>

<div class="px-6 py-16">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class={isAstro ? 'mb-12 text-center' : 'mb-10'}>
			<EditableText
				value={content['page-subtitle'] ?? ''}
				{slug}
				section="page-subtitle"
				{clubType}
				fieldType="short"
				tag="p"
				label="Page subtitle"
				class={isAstro
					? 'font-mono text-xs tracking-[0.3em] text-[#4f46e5]/80 mb-3'
					: 'font-body text-sm tracking-widest text-[#0e79b2]/70 uppercase mb-2'}
			/>
			<EditableText
				value={content['page-title'] ?? ''}
				{slug}
				section="page-title"
				{clubType}
				fieldType="short"
				tag="h1"
				label="Page title"
				class={isAstro
					? 'font-display text-4xl font-bold tracking-tight text-[#f5f0e8]'
					: 'font-display text-4xl font-bold tracking-tight text-[#191923]'}
			/>
			{#if hasDescription}
				<EditableText
					value={content['page-description'] ?? ''}
					{slug}
					section="page-description"
					{clubType}
					fieldType="short"
					tag="p"
					label="Description below title"
					class={isAstro
						? 'font-body text-lg text-[#f5f0e8]/50 mt-3'
						: 'font-body text-lg text-[#191923]/50 mt-3'}
				/>
			{/if}
			<!-- Divider -->
			{#if isAstro}
				<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#4f46e5] to-transparent"></div>
			{:else}
				<div class="mt-4 w-16 h-0.5 bg-[#0e79b2]/30"></div>
			{/if}
		</div>

		<!-- Placeholder content area -->
		<div
			class="rounded-xl border-2 border-dashed px-8 py-16 text-center {isAstro
				? 'border-[#4f46e5]/20 bg-[#4f46e5]/5'
				: 'border-gray-200 bg-gray-50'}"
		>
			<svg class="w-10 h-10 mx-auto mb-3 {isAstro ? 'text-[#4f46e5]/30' : 'text-gray-300'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
			</svg>
			<p class="text-sm {isAstro ? 'text-[#f5f0e8]/30' : 'text-gray-400'}">
				{placeholderLabel}
			</p>
		</div>
	</div>
</div>
