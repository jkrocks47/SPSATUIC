<script lang="ts">
	import type { ContentEntry } from '$lib/utils/content-registry';
	import ContentEditor from './ContentEditor.svelte';
	import ClubInfoPanel from './ClubInfoPanel.svelte';
	import PageSelector from './PageSelector.svelte';
	import MockPageFrame from './MockPageFrame.svelte';
	import MockHomePage from './mock-pages/MockHomePage.svelte';
	import MockAboutPage from './mock-pages/MockAboutPage.svelte';
	import MockJoinPage from './mock-pages/MockJoinPage.svelte';
	import MockContactPage from './mock-pages/MockContactPage.svelte';
	import MockSimplePage from './mock-pages/MockSimplePage.svelte';
	import MockRootHomePage from './mock-pages/MockRootHomePage.svelte';

	interface Props {
		contentBySlug: Record<string, Record<string, string>>;
		clubType: string | null;
		clubInfo?: {
			aboutText?: string | null;
			meetingInfo?: string | null;
			contactEmail?: string | null;
			socialLinks?: Record<string, string> | null;
		} | null;
		entries: ContentEntry[];
		pageGroups: string[];
	}

	let { contentBySlug, clubType, clubInfo = null, entries, pageGroups }: Props = $props();

	let viewMode = $state<'visual' | 'form'>('visual');
	let activePage = $state(pageGroups[0] ?? '');

	// Map page group names to slugs
	const pageToSlug: Record<string, string> = {
		'Root Homepage': 'root-home',
		'Homepage': 'home',
		'About Page': 'about',
		'Join Page': 'join',
		'Contact Page': 'contact',
		'Board Page': 'board',
		'Events Page': 'events',
		'Gallery Page': 'gallery'
	};

	// Map page group names to live URLs
	function getLiveUrl(page: string): string {
		const slug = pageToSlug[page];
		if (!clubType) return '/';
		if (slug === 'home') return `/${clubType}`;
		return `/${clubType}/${slug}`;
	}

	// Simple page config for MockSimplePage
	const simplePageConfig: Record<string, { placeholderLabel: string; hasDescription: boolean }> = {
		'Board Page': { placeholderLabel: 'Officer cards appear here (managed in Officers page)', hasDescription: true },
		'Events Page': { placeholderLabel: 'Event listings appear here (managed in Events page)', hasDescription: false },
		'Gallery Page': { placeholderLabel: 'Gallery images appear here (managed in Gallery page)', hasDescription: false }
	};

	// Flatten contentBySlug to a single Record<string, string> for the form editor fallback
	const flatContent = $derived(() => {
		const flat: Record<string, string> = {};
		for (const [, sections] of Object.entries(contentBySlug)) {
			Object.assign(flat, sections);
		}
		return flat;
	});

	const activeSlug = $derived(pageToSlug[activePage] ?? '');
	const activeContent = $derived(contentBySlug[activeSlug] ?? {});
</script>

<div class="space-y-6">
	<!-- Mode toggle -->
	<div class="flex items-center justify-between">
		<div class="flex bg-gray-100 rounded-lg p-1">
			<button
				class="px-4 py-2 text-sm font-medium rounded-md transition-colors {viewMode === 'visual'
					? 'bg-white text-gray-900 shadow-sm'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (viewMode = 'visual')}
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
					Visual Editor
				</span>
			</button>
			<button
				class="px-4 py-2 text-sm font-medium rounded-md transition-colors {viewMode === 'form'
					? 'bg-white text-gray-900 shadow-sm'
					: 'text-gray-500 hover:text-gray-700'}"
				onclick={() => (viewMode = 'form')}
			>
				<span class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
					</svg>
					Form Editor
				</span>
			</button>
		</div>
		<p class="text-xs text-gray-400">
			{viewMode === 'visual' ? 'Click on any text in the preview to edit it' : 'Edit content using form fields'}
		</p>
	</div>

	{#if viewMode === 'visual'}
		<!-- Club Info Panel -->
		<ClubInfoPanel {clubInfo} {clubType} />

		<!-- Page selector tabs -->
		<PageSelector {pageGroups} {entries} {activePage} onselect={(page) => (activePage = page)} />

		<!-- Mock page preview -->
		<MockPageFrame pageName={activePage} {clubType} liveUrl={getLiveUrl(activePage)}>
			{#if activePage === 'Homepage'}
				<MockHomePage content={activeContent} {clubType} />
			{:else if activePage === 'About Page'}
				<MockAboutPage content={activeContent} {clubType} />
			{:else if activePage === 'Join Page'}
				<MockJoinPage content={activeContent} {clubType} />
			{:else if activePage === 'Contact Page'}
				<MockContactPage content={activeContent} {clubType} />
			{:else if activePage === 'Root Homepage'}
				<MockRootHomePage content={activeContent} />
			{:else if simplePageConfig[activePage]}
				<MockSimplePage
					content={activeContent}
					slug={activeSlug}
					{clubType}
					placeholderLabel={simplePageConfig[activePage].placeholderLabel}
					hasDescription={simplePageConfig[activePage].hasDescription}
				/>
			{/if}
		</MockPageFrame>
	{:else}
		<!-- Fallback: original form-based editor -->
		<ContentEditor
			{entries}
			content={flatContent()}
			{clubType}
			{clubInfo}
			{pageGroups}
		/>
	{/if}
</div>
