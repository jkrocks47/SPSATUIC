<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		clubType: string | null;
	}

	let { content, clubType }: Props = $props();

	const isAstro = clubType === 'astronomy';
	const slug = 'home';
</script>

<div>
	<!-- Hero Section -->
	<div class="relative px-6 py-20 text-center {isAstro
		? 'bg-gradient-to-b from-[#0c0618] via-[#080510] to-[#080510]'
		: 'bg-gradient-to-b from-[#fbfef9] to-white'}" style="min-height: 320px;">
		<!-- Simplified background decoration -->
		{#if isAstro}
			<div class="absolute inset-0 opacity-20" style="background: radial-gradient(ellipse 60% 50% at 30% 40%, rgba(168,85,247,0.3) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 70% 30%, rgba(34,211,238,0.15) 0%, transparent 50%);"></div>
		{/if}

		<div class="relative z-10 flex flex-col items-center justify-center" style="min-height: 240px;">
			<EditableText
				value={content['hero-title'] ?? ''}
				{slug}
				section="hero-title"
				{clubType}
				fieldType="short"
				tag="h1"
				label="Hero title on the club homepage"
				class={isAstro
					? 'font-display text-5xl font-bold tracking-tight text-[#f5f0e8] uppercase mb-4'
					: 'font-display text-5xl font-bold tracking-tight text-[#191923] mb-4'}
			/>
			<EditableText
				value={content['hero-subtitle'] ?? ''}
				{slug}
				section="hero-subtitle"
				{clubType}
				fieldType="long"
				tag="p"
				label="Hero subtitle / description text"
				class={isAstro
					? 'font-body text-base text-[#f5f0e8]/60 max-w-xl mx-auto mb-6'
					: 'font-body text-lg text-[#191923]/60 max-w-xl mx-auto mb-6'}
			/>
			<div class="inline-block">
				<EditableText
					value={content['hero-cta'] ?? ''}
					{slug}
					section="hero-cta"
					{clubType}
					fieldType="short"
					tag="span"
					label="Hero call-to-action button text"
					class={isAstro
						? 'font-mono text-xs tracking-[0.15em] text-[#22d3ee] border border-[#22d3ee]/30 rounded px-6 py-2.5 inline-block'
						: 'font-body text-sm text-white bg-[#0e79b2] rounded-full px-8 py-3 inline-block'}
				/>
			</div>
		</div>
	</div>

	<!-- Events Section -->
	<div class="px-6 py-12 {isAstro ? '' : 'bg-[#fbfef9]'}">
		<div class="max-w-3xl mx-auto">
			<div class="flex items-end justify-between mb-6">
				<div>
					<EditableText
						value={content['events-subtitle'] ?? ''}
						{slug}
						section="events-subtitle"
						{clubType}
						fieldType="short"
						tag="p"
						label="Events section subtitle"
						class={isAstro
							? 'font-mono text-xs tracking-[0.3em] text-[#4f46e5]/80 mb-2'
							: 'font-body text-sm tracking-widest text-[#0e79b2]/70 uppercase mb-2'}
					/>
					<EditableText
						value={content['events-title'] ?? ''}
						{slug}
						section="events-title"
						{clubType}
						fieldType="short"
						tag="h2"
						label="Events section title"
						class={isAstro
							? 'font-display text-2xl font-bold text-[#f5f0e8]'
							: 'font-display text-2xl font-bold text-[#191923]'}
					/>
				</div>
			</div>
			<!-- Placeholder event cards -->
			<div class="grid grid-cols-3 gap-3">
				{#each [1, 2, 3] as _}
					<div class={isAstro
						? 'rounded-lg border border-[#4f46e5]/15 bg-[#0d1b2a]/40 overflow-hidden'
						: 'rounded-2xl border border-gray-100 bg-white overflow-hidden'}>
						<div class={isAstro ? 'h-20 bg-[#4f46e5]/10' : 'h-20 bg-[#0e79b2]/5'}></div>
						<div class="p-3 space-y-2">
							<div class={isAstro ? 'h-2 w-16 rounded bg-[#f5f0e8]/10' : 'h-2 w-16 rounded bg-gray-200'}></div>
							<div class={isAstro ? 'h-3 w-full rounded bg-[#f5f0e8]/15' : 'h-3 w-full rounded bg-gray-200'}></div>
							<div class={isAstro ? 'h-2 w-12 rounded bg-[#f5f0e8]/8' : 'h-2 w-12 rounded bg-gray-100'}></div>
						</div>
					</div>
				{/each}
			</div>
			<p class="text-center mt-2 text-xs {isAstro ? 'text-[#f5f0e8]/20' : 'text-gray-300'} italic">Event cards are populated dynamically</p>
		</div>
	</div>

	<!-- Gallery Section -->
	<div class="px-6 py-12 {isAstro ? '' : 'bg-white'}">
		<div class="max-w-3xl mx-auto">
			<div class="flex items-end justify-between mb-6">
				<div>
					<EditableText
						value={content['gallery-subtitle'] ?? ''}
						{slug}
						section="gallery-subtitle"
						{clubType}
						fieldType="short"
						tag="p"
						label="Gallery section subtitle"
						class={isAstro
							? 'font-mono text-xs tracking-[0.3em] text-[#4f46e5]/80 mb-2'
							: 'font-body text-sm tracking-widest text-[#0e79b2]/70 uppercase mb-2'}
					/>
					<EditableText
						value={content['gallery-title'] ?? ''}
						{slug}
						section="gallery-title"
						{clubType}
						fieldType="short"
						tag="h2"
						label="Gallery section title"
						class={isAstro
							? 'font-display text-2xl font-bold text-[#f5f0e8]'
							: 'font-display text-2xl font-bold text-[#191923]'}
					/>
				</div>
			</div>
			<!-- Placeholder gallery grid -->
			<div class="grid grid-cols-3 gap-3">
				{#each [1, 2, 3] as _}
					<div class={isAstro
						? 'h-24 rounded-lg bg-[#4f46e5]/10 border border-[#4f46e5]/15'
						: 'h-24 rounded-xl bg-gray-100'}></div>
				{/each}
			</div>
			<p class="text-center mt-2 text-xs {isAstro ? 'text-[#f5f0e8]/20' : 'text-gray-300'} italic">Gallery images are uploaded separately</p>
		</div>
	</div>

	<!-- About Section -->
	<div class="px-6 py-12">
		<div class="max-w-3xl mx-auto {isAstro ? '' : 'text-center'}">
			<EditableText
				value={content['about-subtitle'] ?? ''}
				{slug}
				section="about-subtitle"
				{clubType}
				fieldType="short"
				tag="p"
				label="About section subtitle"
				class={isAstro
					? 'font-mono text-xs tracking-[0.3em] text-[#4f46e5]/80 mb-2'
					: 'font-body text-sm tracking-widest text-[#0e79b2]/70 uppercase mb-2'}
			/>
			<EditableText
				value={content['about-title'] ?? ''}
				{slug}
				section="about-title"
				{clubType}
				fieldType="short"
				tag="h2"
				label="About section title"
				class={isAstro
					? 'font-display text-2xl font-bold text-[#f5f0e8] mb-4'
					: 'font-display text-2xl font-bold text-[#191923] mb-4'}
			/>
			<EditableText
				value={content['about-body'] ?? ''}
				{slug}
				section="about-body"
				{clubType}
				fieldType="long"
				tag="p"
				label="About section body text"
				class={isAstro
					? 'font-body text-sm text-[#f5f0e8]/60 leading-relaxed max-w-xl'
					: 'font-body text-lg text-[#191923]/60 leading-relaxed max-w-2xl mx-auto'}
			/>
		</div>
	</div>
</div>
