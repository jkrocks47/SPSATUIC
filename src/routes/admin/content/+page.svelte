<script lang="ts">
	import VisualContentEditor from '$lib/components/admin/VisualContentEditor.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>Site Content Editor | Admin</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-800">Site Content Editor</h1>
		<p class="text-sm text-gray-500 mt-1">
			Edit text on the main landing page. Only accessible to super admins.
		</p>
	</div>

	<VisualContentEditor
		contentBySlug={data.contentBySlug}
		clubType={null}
		entries={data.entries}
		pageGroups={data.pageGroups}
	/>
</div>
