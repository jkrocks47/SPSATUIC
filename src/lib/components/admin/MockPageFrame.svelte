<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		pageName: string;
		clubType: string | null;
		liveUrl?: string;
		children: Snippet;
	}

	let { pageName, clubType, liveUrl, children }: Props = $props();

	const themeClasses = $derived(() => {
		if (clubType === 'astronomy') return 'bg-[#080510] text-[#f5f0e8]';
		if (clubType === 'physics') return 'bg-[#fbfef9] text-[#191923]';
		return 'bg-[#060e18] text-[#f5f0e8]'; // root
	});
</script>

<div class="mock-page-frame rounded-xl border border-gray-200 shadow-lg overflow-hidden">
	<!-- Browser chrome bar -->
	<div class="flex items-center justify-between px-4 py-2.5 bg-gray-100 border-b border-gray-200">
		<div class="flex items-center gap-3">
			<!-- Traffic light dots -->
			<div class="flex gap-1.5">
				<div class="w-3 h-3 rounded-full bg-red-400"></div>
				<div class="w-3 h-3 rounded-full bg-yellow-400"></div>
				<div class="w-3 h-3 rounded-full bg-green-400"></div>
			</div>
			<!-- URL bar -->
			<div class="flex items-center gap-2 bg-white rounded-md px-3 py-1 text-xs text-gray-500 border border-gray-200 min-w-[200px]">
				<svg class="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
				</svg>
				{#if liveUrl}
					<span>{liveUrl}</span>
				{:else if clubType}
					<span>/{clubType}/{pageName === 'Homepage' ? '' : pageName.toLowerCase().replace(' page', '')}</span>
				{:else}
					<span>/</span>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-xs font-medium text-gray-600">{pageName}</span>
			{#if liveUrl}
				<a
					href={liveUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
					onclick={(e) => { e.preventDefault(); window.open(liveUrl, '_blank'); }}
				>
					View live
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
				</a>
			{/if}
		</div>
	</div>

	<!-- Page preview content -->
	<div class="mock-page-content {themeClasses()} font-body overflow-y-auto" style="max-height: 70vh;">
		{@render children()}
	</div>
</div>

<style>
	.mock-page-frame {
		max-width: 100%;
	}
</style>
