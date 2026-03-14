<script lang="ts">
	import { enhance } from '$app/forms';

	interface Props {
		clubInfo: {
			aboutText?: string | null;
			meetingInfo?: string | null;
			contactEmail?: string | null;
			socialLinks?: Record<string, string> | null;
		} | null;
		clubType: string | null;
	}

	let { clubInfo, clubType }: Props = $props();

	let expanded = $state(false);
	let savedSections: Record<string, boolean> = $state({});

	function showSaved(key: string) {
		savedSections[key] = true;
		setTimeout(() => {
			savedSections[key] = false;
		}, 2000);
	}
</script>

{#if clubInfo && clubType}
	<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
		<button
			class="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
			onclick={() => (expanded = !expanded)}
		>
			<div class="flex items-center gap-3">
				<span class="text-lg font-semibold text-gray-800">Club Info</span>
				<span class="text-xs text-gray-400 font-normal">About text, meetings, contact email, social links</span>
			</div>
			<span class="text-gray-400 text-sm">{expanded ? '▼' : '▶'}</span>
		</button>

		{#if expanded}
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
						<label for="club-aboutText" class="block text-sm font-medium text-gray-700">About Text</label>
						<p class="text-xs text-gray-400">Shown on the About page under "Our Mission"</p>
						<textarea
							id="club-aboutText"
							name="value"
							rows="4"
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						>{clubInfo.aboutText ?? ''}</textarea>
						<div class="flex items-center gap-3">
							<button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">Save</button>
							{#if savedSections['club-about']}<span class="text-sm text-green-600">Saved!</span>{/if}
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
						<label for="club-meetingInfo" class="block text-sm font-medium text-gray-700">Meeting Info</label>
						<p class="text-xs text-gray-400">Shown on the About page under "Meetings"</p>
						<textarea
							id="club-meetingInfo"
							name="value"
							rows="3"
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						>{clubInfo.meetingInfo ?? ''}</textarea>
						<div class="flex items-center gap-3">
							<button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">Save</button>
							{#if savedSections['club-meeting']}<span class="text-sm text-green-600">Saved!</span>{/if}
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
						<label for="club-contactEmail" class="block text-sm font-medium text-gray-700">Contact Email</label>
						<p class="text-xs text-gray-400">Shown on the Contact page</p>
						<input
							id="club-contactEmail"
							type="email"
							name="value"
							value={clubInfo.contactEmail ?? ''}
							class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
						/>
						<div class="flex items-center gap-3">
							<button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">Save</button>
							{#if savedSections['club-email']}<span class="text-sm text-green-600">Saved!</span>{/if}
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
							<button type="submit" class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors">Save</button>
							{#if savedSections['club-social']}<span class="text-sm text-green-600">Saved!</span>{/if}
						</div>
					</div>
				</form>
			</div>
		{/if}
	</div>
{/if}
