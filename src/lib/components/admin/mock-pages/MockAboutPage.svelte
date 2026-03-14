<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		clubType: string | null;
	}

	let { content, clubType }: Props = $props();

	const isAstro = clubType === 'astronomy';
	const slug = 'about';
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
			<EditableText
				value={content['page-description'] ?? ''}
				{slug}
				section="page-description"
				{clubType}
				fieldType="short"
				tag="p"
				label="Short description below title"
				class={isAstro
					? 'font-body text-lg text-[#f5f0e8]/50 mt-3'
					: 'font-body text-lg text-[#191923]/50 mt-3'}
			/>
			{#if isAstro}
				<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#4f46e5] to-transparent"></div>
			{:else}
				<div class="mt-4 w-16 h-0.5 bg-[#0e79b2]/30"></div>
			{/if}
		</div>

		<!-- Our Mission (clubInfo — not editable here) -->
		<div class={isAstro
			? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 backdrop-blur-sm p-8 mb-8'
			: 'bg-white rounded-2xl border border-gray-100 p-8 mb-6'}>
			<h2 class={isAstro
				? 'font-display text-2xl font-bold text-[#f5f0e8] mb-4'
				: 'font-display text-2xl font-bold text-[#191923] mb-4'}>Our Mission</h2>
			<p class={isAstro
				? 'font-body text-sm text-[#f5f0e8]/60 leading-relaxed'
				: 'font-body text-sm text-[#191923]/60 leading-relaxed'}>
				Club about text appears here. Edit in the Club Info panel above.
			</p>
			<p class="mt-2 text-xs {isAstro ? 'text-[#4f46e5]/50' : 'text-[#0e79b2]/50'} italic">
				(Editable via Club Info panel)
			</p>
		</div>

		<!-- Meetings (clubInfo — not editable here) -->
		<div class={isAstro
			? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 backdrop-blur-sm p-8 mb-8'
			: 'bg-white rounded-2xl border border-gray-100 p-8 mb-6'}>
			<h2 class={isAstro
				? 'font-display text-2xl font-bold text-[#f5f0e8] mb-4'
				: 'font-display text-2xl font-bold text-[#191923] mb-4'}>Meetings</h2>
			<p class={isAstro
				? 'font-body text-sm text-[#f5f0e8]/60 leading-relaxed'
				: 'font-body text-sm text-[#191923]/60 leading-relaxed'}>
				Meeting info appears here. Edit in the Club Info panel above.
			</p>
			<p class="mt-2 text-xs {isAstro ? 'text-[#4f46e5]/50' : 'text-[#0e79b2]/50'} italic">
				(Editable via Club Info panel)
			</p>
		</div>

		<!-- Officers placeholder -->
		<div class="mb-8">
			<h2 class={isAstro
				? 'font-display text-2xl font-bold text-[#f5f0e8] mb-6 text-center'
				: 'font-display text-2xl font-bold text-[#191923] mb-6'}>Officers</h2>
			<div class="grid grid-cols-3 gap-4">
				{#each [1, 2, 3] as _}
					<div class={isAstro
						? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 p-4 text-center'
						: 'bg-white rounded-2xl border border-gray-100 p-4 text-center'}>
						<div class={isAstro
							? 'w-14 h-14 rounded-full mx-auto mb-3 bg-[#4f46e5]/20'
							: 'w-14 h-14 rounded-full mx-auto mb-3 bg-[#0e79b2]/10'}></div>
						<div class={isAstro
							? 'h-3 w-20 mx-auto rounded bg-[#f5f0e8]/15 mb-2'
							: 'h-3 w-20 mx-auto rounded bg-gray-200 mb-2'}></div>
						<div class={isAstro
							? 'h-2 w-14 mx-auto rounded bg-[#4f46e5]/20'
							: 'h-2 w-14 mx-auto rounded bg-[#0e79b2]/15'}></div>
					</div>
				{/each}
			</div>
			<p class="text-center mt-3 text-xs {isAstro ? 'text-[#f5f0e8]/30' : 'text-gray-400'} italic">
				Officer cards managed in Officers admin page
			</p>
		</div>

		<!-- History -->
		<div class={isAstro
			? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 backdrop-blur-sm p-8'
			: 'bg-white rounded-2xl border border-gray-100 p-8'}>
			<h2 class={isAstro
				? 'font-display text-2xl font-bold text-[#f5f0e8] mb-4'
				: 'font-display text-2xl font-bold text-[#191923] mb-4'}>History</h2>
			<EditableText
				value={content['history-body'] ?? ''}
				{slug}
				section="history-body"
				{clubType}
				fieldType="markdown"
				tag="div"
				label="History section text (supports markdown)"
				class={isAstro
					? 'font-body text-sm text-[#f5f0e8]/70 leading-relaxed'
					: 'font-body text-sm text-[#191923]/60 leading-relaxed'}
			/>
		</div>
	</div>
</div>
