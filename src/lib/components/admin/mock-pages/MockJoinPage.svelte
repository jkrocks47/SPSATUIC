<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		clubType: string | null;
	}

	let { content, clubType }: Props = $props();

	const isAstro = clubType === 'astronomy';
	const slug = 'join';
</script>

<div class="px-6 py-16">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class={isAstro ? 'mb-10 text-center' : 'mb-10'}>
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
					? 'font-display text-4xl font-bold tracking-tight text-[#f5f0e8] uppercase'
					: 'font-display text-4xl font-bold tracking-tight text-[#191923]'}
			/>
			{#if isAstro}
				<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#4f46e5] to-transparent"></div>
			{:else}
				<div class="mt-4 w-16 h-0.5 bg-[#0e79b2]/30"></div>
			{/if}
		</div>

		<!-- Intro text -->
		<EditableText
			value={content['intro-text'] ?? ''}
			{slug}
			section="intro-text"
			{clubType}
			fieldType="long"
			tag="p"
			label="Intro paragraph below title"
			class={isAstro
				? 'font-body text-sm text-[#f5f0e8]/60 leading-relaxed mb-10'
				: 'font-body text-base text-[#191923]/60 leading-relaxed mb-10'}
		/>

		<!-- Two-column: Benefits + CTA -->
		<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
			<!-- Benefits grid (3 cols) -->
			<div class="lg:col-span-3">
				<div class="grid grid-cols-2 gap-4">
					{#each [1, 2, 3, 4] as n}
						{@const icon = ['🔭', '🎓', '🛠️', '🌟'][n - 1]}
						<div class={isAstro
							? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 p-5'
							: 'bg-white rounded-2xl border border-gray-100 p-5'}>
							{#if isAstro}
								<span class="font-mono text-lg text-[#22d3ee]/60 mb-3 block">{icon}</span>
							{:else}
								<div class="w-8 h-8 rounded-full bg-[#0e79b2]/10 flex items-center justify-center mb-3">
									<span class="font-display text-sm font-bold text-[#0e79b2]">{n}</span>
								</div>
							{/if}
							<EditableText
								value={content[`benefit-${n}-title`] ?? ''}
								{slug}
								section="benefit-{n}-title"
								{clubType}
								fieldType="short"
								tag="h3"
								label="Benefit card {n} — title"
								class={isAstro
									? 'font-display text-sm font-bold text-[#f5f0e8] uppercase mb-2'
									: 'font-display text-sm font-bold text-[#191923] mb-2'}
							/>
							<EditableText
								value={content[`benefit-${n}-body`] ?? ''}
								{slug}
								section="benefit-{n}-body"
								{clubType}
								fieldType="long"
								tag="p"
								label="Benefit card {n} — description"
								class={isAstro
									? 'font-body text-xs text-[#f5f0e8]/40 leading-relaxed'
									: 'font-body text-xs text-[#191923]/50 leading-relaxed'}
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- CTA card (2 cols) -->
			<div class="lg:col-span-2">
				<div class={isAstro
					? 'rounded-xl border border-[#22d3ee]/20 bg-[#0d1b2a]/80 p-6 h-full flex flex-col justify-center'
					: 'bg-white rounded-2xl border border-gray-100 p-6 h-full flex flex-col justify-center text-center'}>
					{#if isAstro}
						<p class="font-mono text-[10px] tracking-[0.3em] text-[#22d3ee]/50 mb-3">REGISTRATION PORTAL</p>
					{/if}
					<EditableText
						value={content['cta-title'] ?? ''}
						{slug}
						section="cta-title"
						{clubType}
						fieldType="short"
						tag="h2"
						label="CTA section title"
						class={isAstro
							? 'font-display text-xl font-bold text-[#f5f0e8] mb-3'
							: 'font-display text-xl font-bold text-[#191923] mb-3'}
					/>
					<EditableText
						value={content['cta-body'] ?? ''}
						{slug}
						section="cta-body"
						{clubType}
						fieldType="long"
						tag="p"
						label="CTA section body text"
						class={isAstro
							? 'font-body text-xs text-[#f5f0e8]/50 leading-relaxed mb-5'
							: 'font-body text-sm text-[#191923]/50 leading-relaxed mb-5'}
					/>
					<!-- Placeholder button -->
					<div class={isAstro
						? 'font-mono text-xs tracking-[0.15em] text-[#22d3ee]/60 border border-[#22d3ee]/20 rounded px-4 py-2 text-center'
						: 'font-body text-sm text-white bg-[#0e79b2]/60 rounded-full px-6 py-2.5 text-center mx-auto'}>
						{isAstro ? '[ REGISTER NOW ]' : 'Register'}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
