<script lang="ts">
	import type { ContentEntry } from '$lib/utils/content-registry';

	interface Props {
		pageGroups: string[];
		entries: ContentEntry[];
		activePage: string;
		onselect: (page: string) => void;
	}

	let { pageGroups, entries, activePage, onselect }: Props = $props();

	function countForPage(page: string): number {
		return entries.filter((e) => e.page === page).length;
	}
</script>

<div class="flex gap-1 overflow-x-auto pb-1 border-b border-gray-200">
	{#each pageGroups as page}
		<button
			class="px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors relative
				{activePage === page
					? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
					: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}"
			onclick={() => onselect(page)}
		>
			{page}
			<span class="ml-1.5 text-[10px] font-normal {activePage === page ? 'text-indigo-400' : 'text-gray-400'}">
				{countForPage(page)}
			</span>
		</button>
	{/each}
</div>
