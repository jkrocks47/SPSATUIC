<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
	}

	let { content }: Props = $props();

	const slug = 'root-home';
	const clubType = null;
</script>

<div class="text-[#f5f0e8]" style="background: linear-gradient(160deg, #060e18 0%, #0d1b2a 30%, #1b2838 55%, #9B0A1A 90%, #CE1126 100%);">
	<!-- Header / Logo -->
	<div class="px-6 pt-8 pb-4">
		<div class="max-w-3xl mx-auto flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold">
					<span class="text-[#CE1126]">UIC</span><span class="text-[#f5f0e8]/80">Spacetime</span>
				</h1>
				<p class="font-mono text-[10px] tracking-[0.15em] text-[#f5f0e8]/40 mt-0.5">Society of Physics Students at UIC</p>
			</div>
			<span class="font-mono text-xs text-[#f5f0e8]/30">Sign In / Join</span>
		</div>
	</div>

	<!-- Portal cards placeholder -->
	<div class="px-6 py-6">
		<div class="max-w-3xl mx-auto grid grid-cols-2 gap-4">
			<div class="rounded-xl h-28 bg-gradient-to-br from-[#4f46e5]/15 to-[#a855f7]/10 border border-[#4f46e5]/20 flex items-center justify-center">
				<span class="font-display text-sm text-[#f5f0e8]/50">Astronomy Club</span>
			</div>
			<div class="rounded-xl h-28 bg-gradient-to-br from-[#0e79b2]/15 to-[#0e79b2]/5 border border-[#0e79b2]/20 flex items-center justify-center">
				<span class="font-display text-sm text-[#f5f0e8]/50">Physics Club</span>
			</div>
		</div>
	</div>

	<!-- Hero tagline -->
	<div class="px-6 py-6">
		<div class="max-w-3xl mx-auto text-center">
			<EditableText
				value={content['hero-tagline'] ?? ''}
				{slug}
				section="hero-tagline"
				{clubType}
				fieldType="short"
				tag="p"
				label="Hero tagline on the main landing page"
				class="font-body text-base italic text-[#f5f0e8]/60"
			/>
			<div class="mt-3 mx-auto w-16 h-px bg-[#CE1126]/40"></div>
		</div>
	</div>

	<!-- Calendar placeholder -->
	<div class="px-6 py-4">
		<div class="max-w-3xl mx-auto">
			<div class="rounded-xl border border-[#f5f0e8]/10 bg-[#0d1b2a]/40 p-6 text-center">
				<p class="text-xs text-[#f5f0e8]/30 italic">Event calendar appears here</p>
			</div>
		</div>
	</div>

	<!-- About SPS section -->
	<div class="px-6 py-8">
		<div class="max-w-3xl mx-auto">
			<div class="text-center mb-6">
				<EditableText
					value={content['about-subtitle'] ?? ''}
					{slug}
					section="about-subtitle"
					{clubType}
					fieldType="short"
					tag="p"
					label="Section subtitle above About SPS heading"
					class="font-mono text-[10px] tracking-[0.3em] text-[#CE1126]/70 uppercase mb-2"
				/>
				<EditableText
					value={content['about-heading'] ?? ''}
					{slug}
					section="about-heading"
					{clubType}
					fieldType="short"
					tag="h2"
					label="Main about heading on landing page"
					class="font-display text-2xl font-bold text-[#f5f0e8]"
				/>
			</div>

			<!-- Mission + Meetings placeholders -->
			<div class="grid grid-cols-2 gap-4 mb-6">
				<div class="rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 p-5">
					<h3 class="font-display text-sm font-bold text-[#f5f0e8] mb-2">Our Mission</h3>
					<p class="text-xs text-[#f5f0e8]/40 italic">Managed in Club Info</p>
				</div>
				<div class="rounded-xl border border-[#4f46e5]/20 bg-[#0d1b2a]/60 p-5">
					<h3 class="font-display text-sm font-bold text-[#f5f0e8] mb-2">Meetings</h3>
					<p class="text-xs text-[#f5f0e8]/40 italic">Managed in Club Info</p>
				</div>
			</div>
		</div>
	</div>

	<!-- History -->
	<div class="px-6 py-6">
		<div class="max-w-3xl mx-auto">
			<div class="border-l-2 border-[#CE1126]/30 pl-6">
				<EditableText
					value={content['history-lead'] ?? ''}
					{slug}
					section="history-lead"
					{clubType}
					fieldType="long"
					tag="p"
					label="History lead text (italic intro line)"
					class="font-body text-sm italic text-[#f5f0e8]/70 mb-3"
				/>
				<EditableText
					value={content['history-body'] ?? ''}
					{slug}
					section="history-body"
					{clubType}
					fieldType="long"
					tag="p"
					label="History body paragraph"
					class="font-body text-sm text-[#f5f0e8]/50 leading-relaxed"
				/>
			</div>
		</div>
	</div>

	<!-- Stats strip -->
	<div class="px-6 py-6">
		<div class="max-w-3xl mx-auto">
			<div class="flex items-center justify-center gap-4 text-center">
				<EditableText
					value={content['stats-1'] ?? ''}
					{slug}
					section="stats-1"
					{clubType}
					fieldType="short"
					tag="span"
					label="Stats strip — first item"
					class="font-mono text-[10px] tracking-[0.2em] text-[#f5f0e8]/30 uppercase"
				/>
				<span class="text-[#f5f0e8]/20">&bull;</span>
				<EditableText
					value={content['stats-2'] ?? ''}
					{slug}
					section="stats-2"
					{clubType}
					fieldType="short"
					tag="span"
					label="Stats strip — second item"
					class="font-mono text-[10px] tracking-[0.2em] text-[#f5f0e8]/30 uppercase"
				/>
				<span class="text-[#f5f0e8]/20">&bull;</span>
				<EditableText
					value={content['stats-3'] ?? ''}
					{slug}
					section="stats-3"
					{clubType}
					fieldType="short"
					tag="span"
					label="Stats strip — third item"
					class="font-mono text-[10px] tracking-[0.2em] text-[#f5f0e8]/30 uppercase"
				/>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="px-6 py-8">
		<div class="max-w-3xl mx-auto text-center">
			<EditableText
				value={content['footer-text'] ?? ''}
				{slug}
				section="footer-text"
				{clubType}
				fieldType="short"
				tag="p"
				label="Footer text at bottom of landing page"
				class="font-mono text-xs tracking-[0.2em] text-[#f5f0e8]/25 uppercase"
			/>
		</div>
	</div>
</div>
