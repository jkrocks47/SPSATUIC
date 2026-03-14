<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		clubType: string | null;
	}

	let { content, clubType }: Props = $props();

	const isAstro = clubType === 'astronomy';
	const slug = 'contact';
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
			{#if isAstro}
				<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#4f46e5] to-transparent"></div>
			{:else}
				<div class="mt-4 w-16 h-0.5 bg-[#0e79b2]/30"></div>
			{/if}
		</div>

		<!-- Two column layout -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Contact Info -->
			<div class="flex flex-col gap-4">
				<div class={isAstro
					? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 backdrop-blur-sm p-6'
					: 'bg-white rounded-2xl border border-gray-100 p-6'}>
					<EditableText
						value={content['contact-heading'] ?? ''}
						{slug}
						section="contact-heading"
						{clubType}
						fieldType="short"
						tag="h3"
						label="Contact heading"
						class={isAstro
							? 'font-display text-lg font-bold text-[#f5f0e8] mb-4'
							: 'font-display text-lg font-bold text-[#191923] mb-4'}
					/>
					<div class="space-y-3">
						<div>
							<p class={isAstro
								? 'font-mono text-[10px] tracking-[0.2em] text-[#f5f0e8]/40 mb-1'
								: 'font-body text-xs text-[#191923]/40 uppercase tracking-wider mb-1'}>
								{isAstro ? 'EMAIL' : 'Email'}
							</p>
							<p class={isAstro ? 'font-mono text-sm text-[#22d3ee]' : 'font-body text-sm text-[#0e79b2]'}>
								club@uic.edu
							</p>
							<p class="mt-1 text-xs {isAstro ? 'text-[#f5f0e8]/30' : 'text-gray-400'} italic">
								(Edit email in Club Info panel above)
							</p>
						</div>
						<div>
							<p class={isAstro
								? 'font-mono text-[10px] tracking-[0.2em] text-[#f5f0e8]/40 mb-1'
								: 'font-body text-xs text-[#191923]/40 uppercase tracking-wider mb-1'}>
								{isAstro ? 'LOCATION' : 'Location'}
							</p>
							<p class={isAstro ? 'font-body text-sm text-[#f5f0e8]/70' : 'font-body text-sm text-[#191923]/60'}>
								University of Illinois at Chicago
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Contact Form Placeholder -->
			<div class={isAstro
				? 'rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 backdrop-blur-sm p-6'
				: 'bg-white rounded-2xl border border-gray-100 p-6'}>
				<EditableText
					value={content['form-heading'] ?? ''}
					{slug}
					section="form-heading"
					{clubType}
					fieldType="short"
					tag="h3"
					label="Form heading"
					class={isAstro
						? 'font-display text-lg font-bold text-[#f5f0e8] mb-4'
						: 'font-display text-lg font-bold text-[#191923] mb-4'}
				/>
				<!-- Placeholder form fields -->
				<div class="space-y-3 opacity-40">
					<div class={isAstro
						? 'h-9 rounded-md border border-[#4f46e5]/20 bg-[#0d1b2a]/40'
						: 'h-9 rounded-md border border-gray-200 bg-gray-50'}></div>
					<div class={isAstro
						? 'h-9 rounded-md border border-[#4f46e5]/20 bg-[#0d1b2a]/40'
						: 'h-9 rounded-md border border-gray-200 bg-gray-50'}></div>
					<div class={isAstro
						? 'h-20 rounded-md border border-[#4f46e5]/20 bg-[#0d1b2a]/40'
						: 'h-20 rounded-md border border-gray-200 bg-gray-50'}></div>
					<div class={isAstro
						? 'h-9 w-24 rounded-md bg-[#22d3ee]/20'
						: 'h-9 w-24 rounded-full bg-[#0e79b2]/20'}></div>
				</div>
			</div>
		</div>
	</div>
</div>
