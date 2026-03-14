<script lang="ts">
	import VisualContentEditor from '$lib/components/admin/VisualContentEditor.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Content Editor | Astronomy Admin</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-800">Astronomy Content Editor</h1>
		<p class="text-sm text-gray-500 mt-1">
			Edit all text content on the Astronomy club pages.
		</p>
	</div>

	<VisualContentEditor
		contentBySlug={data.contentBySlug}
		clubType="astronomy"
		clubInfo={data.clubInfo}
		entries={data.entries}
		pageGroups={data.pageGroups}
	/>
</div>
