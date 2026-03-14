<script lang="ts">
	import { enhance } from '$app/forms';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { ContentEntry } from '$lib/utils/content-registry';

	interface Props {
		entries: ContentEntry[];
		content: Record<string, string>;
		clubType: string | null;
		clubInfo?: {
			aboutText?: string | null;
			meetingInfo?: string | null;
			contactEmail?: string | null;
			socialLinks?: Record<string, string> | null;
		} | null;
		pageGroups: string[];
	}

	let { entries, content, clubType, clubInfo = null, pageGroups }: Props = $props();

	let expandedGroups = $state<Record<string, boolean>>({});
	let previewSections = $state<Record<string, boolean>>({});
	let savedSections = $state<Record<string, boolean>>({});

	function toggleGroup(group: string) {
		expandedGroups[group] = !expandedGroups[group];
	}

	function togglePreview(section: string) {
		previewSections[section] = !previewSections[section];
	}

	function getEntriesForPage(page: string): ContentEntry[] {
		return entries.filter((e) => e.page === page);
	}

	function showSaved(key: string) {
		savedSections[key] = true;
		setTimeout(() => {
			savedSections[key] = false;
		}, 2000);
	}
</script>

<div class="space-y-6">
	<!-- Club Info Section -->
	{#if clubInfo !== undefined && clubInfo !== null && clubType}
		<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<button
				class="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
				onclick={() => toggleGroup('club-info')}
			>
				<div class="flex items-center gap-3">
					<span class="text-lg font-semibold text-gray-800">Club Info</span>
					<span class="text-xs text-gray-400 font-normal">About text, meetings, contact email, social links</span>
				</div>
				<span class="text-gray-400 text-sm">{expandedGroups['club-info'] ? '▼' : '▶'}</span>
			</button>

			{#if expandedGroups['club-info']}
				<div class="p-6 space-y-6 border-t border-gray-100">
					<!-- About Text -->
					<form
						method="POST"
						action="?/updateClubInfo"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								showSaved('club-about');
							};
						}}
					>
						<input type="hidden" name="field" value="aboutText" />
						<div class="space-y-2">
							<label for="club-aboutText" class="block text-sm font-medium text-gray-700">
								About Text
							</label>
							<p class="text-xs text-gray-400">Shown on the About page under "Our Mission"</p>
							<textarea
								id="club-aboutText"
								name="value"
								rows="4"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
							>{clubInfo.aboutText ?? ''}</textarea>
							<div class="flex items-center gap-3">
								<button
									type="submit"
									class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
								>
									Save
								</button>
								{#if savedSections['club-about']}
									<span class="text-sm text-green-600">Saved!</span>
								{/if}
							</div>
						</div>
					</form>

					<!-- Meeting Info -->
					<form
						method="POST"
						action="?/updateClubInfo"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								showSaved('club-meeting');
							};
						}}
					>
						<input type="hidden" name="field" value="meetingInfo" />
						<div class="space-y-2">
							<label for="club-meetingInfo" class="block text-sm font-medium text-gray-700">
								Meeting Info
							</label>
							<p class="text-xs text-gray-400">Shown on the About page under "Meetings"</p>
							<textarea
								id="club-meetingInfo"
								name="value"
								rows="3"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
							>{clubInfo.meetingInfo ?? ''}</textarea>
							<div class="flex items-center gap-3">
								<button
									type="submit"
									class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
								>
									Save
								</button>
								{#if savedSections['club-meeting']}
									<span class="text-sm text-green-600">Saved!</span>
								{/if}
							</div>
						</div>
					</form>

					<!-- Contact Email -->
					<form
						method="POST"
						action="?/updateClubInfo"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								showSaved('club-email');
							};
						}}
					>
						<input type="hidden" name="field" value="contactEmail" />
						<div class="space-y-2">
							<label for="club-contactEmail" class="block text-sm font-medium text-gray-700">
								Contact Email
							</label>
							<p class="text-xs text-gray-400">Shown on the Contact page</p>
							<input
								id="club-contactEmail"
								type="email"
								name="value"
								value={clubInfo.contactEmail ?? ''}
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
							/>
							<div class="flex items-center gap-3">
								<button
									type="submit"
									class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
								>
									Save
								</button>
								{#if savedSections['club-email']}
									<span class="text-sm text-green-600">Saved!</span>
								{/if}
							</div>
						</div>
					</form>

					<!-- Social Links -->
					<form
						method="POST"
						action="?/updateClubInfo"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								showSaved('club-social');
							};
						}}
					>
						<input type="hidden" name="field" value="socialLinks" />
						<div class="space-y-2">
							<label class="block text-sm font-medium text-gray-700">Social Links</label>
							<p class="text-xs text-gray-400">Key-value pairs (e.g., instagram = https://instagram.com/...)</p>
							{#each Object.entries(clubInfo.socialLinks ?? {}) as [platform, url], i}
								<div class="flex gap-2">
									<input
										name="socialKey_{i}"
										value={platform}
										placeholder="Platform"
										class="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
									/>
									<input
										name="socialValue_{i}"
										value={url}
										placeholder="URL"
										class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
									/>
								</div>
							{/each}
							<div class="flex gap-2">
								<input
									name="socialKey_{Object.keys(clubInfo.socialLinks ?? {}).length}"
									placeholder="New platform"
									class="w-1/3 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
								/>
								<input
									name="socialValue_{Object.keys(clubInfo.socialLinks ?? {}).length}"
									placeholder="URL"
									class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
								/>
							</div>
							<div class="flex items-center gap-3">
								<button
									type="submit"
									class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
								>
									Save
								</button>
								{#if savedSections['club-social']}
									<span class="text-sm text-green-600">Saved!</span>
								{/if}
							</div>
						</div>
					</form>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Page Content Sections -->
	{#each pageGroups as group}
		{@const pageEntries = getEntriesForPage(group)}
		{#if pageEntries.length > 0}
			<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<button
					class="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
					onclick={() => toggleGroup(group)}
				>
					<div class="flex items-center gap-3">
						<span class="text-lg font-semibold text-gray-800">{group}</span>
						<span class="text-xs text-gray-400 font-normal">{pageEntries.length} editable sections</span>
					</div>
					<span class="text-gray-400 text-sm">{expandedGroups[group] ? '▼' : '▶'}</span>
				</button>

				{#if expandedGroups[group]}
					<div class="p-6 space-y-6 border-t border-gray-100">
						{#each pageEntries as entry}
							{@const sectionKey = `${entry.slug}|${entry.section}`}
							{@const currentValue = content[entry.section] ?? ''}
							<form
								method="POST"
								action="?/update"
								use:enhance={() => {
									return async ({ update }) => {
										await update();
										showSaved(sectionKey);
									};
								}}
							>
								<input type="hidden" name="slug" value={entry.slug} />
								<input type="hidden" name="section" value={entry.section} />
								{#if clubType}
									<input type="hidden" name="clubType" value={clubType} />
								{/if}

								<div class="space-y-2">
									<label
										for="content-{sectionKey}"
										class="block text-sm font-medium text-gray-700"
									>
										{entry.label}
									</label>
									<p class="text-xs text-gray-400">
										Section: <code class="bg-gray-100 px-1 rounded">{entry.section}</code>
										{#if clubType}
											&middot; Appears on: <code class="bg-gray-100 px-1 rounded">/{clubType}/{entry.slug === 'home' ? '' : entry.slug}</code>
										{:else}
											&middot; Appears on: <code class="bg-gray-100 px-1 rounded">/</code> (main landing page)
										{/if}
									</p>

									{#if entry.fieldType === 'short'}
										<input
											id="content-{sectionKey}"
											type="text"
											name="body"
											value={currentValue}
											class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
										/>
									{:else if entry.fieldType === 'long'}
										<textarea
											id="content-{sectionKey}"
											name="body"
											rows="3"
											class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
										>{currentValue}</textarea>
									{:else if entry.fieldType === 'markdown'}
										<div class="space-y-2">
											<textarea
												id="content-{sectionKey}"
												name="body"
												rows="6"
												class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
											>{currentValue}</textarea>
											<button
												type="button"
												class="text-xs text-indigo-600 hover:text-indigo-800"
												onclick={() => togglePreview(sectionKey)}
											>
												{previewSections[sectionKey] ? 'Hide Preview' : 'Show Preview'}
											</button>
											{#if previewSections[sectionKey]}
												<div class="p-4 bg-gray-50 rounded-md border border-gray-200 prose prose-sm max-w-none">
													{@html renderMarkdown(currentValue)}
												</div>
											{/if}
										</div>
									{/if}

									<div class="flex items-center gap-3">
										<button
											type="submit"
											class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
										>
											Save
										</button>
										{#if savedSections[sectionKey]}
											<span class="text-sm text-green-600">Saved!</span>
										{/if}
									</div>
								</div>
							</form>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/each}
</div>
