<script lang="ts">
	import { enhance } from '$app/forms';
	import { renderMarkdown } from '$lib/utils/markdown';

	interface Props {
		value: string;
		slug: string;
		section: string;
		clubType: string | null;
		fieldType?: 'short' | 'long' | 'markdown';
		tag?: string;
		class?: string;
		label?: string;
		placeholder?: string;
	}

	let {
		value,
		slug,
		section,
		clubType,
		fieldType = 'short',
		tag = 'span',
		class: className = '',
		label = '',
		placeholder = 'Click to edit...'
	}: Props = $props();

	let editing = $state(false);
	let editedValue = $state(value);
	let originalValue = $state(value);
	let saved = $state(false);
	let showMarkdownEditor = $state(false);
	let markdownSource = $state(value);
	let formEl: HTMLFormElement | undefined = $state();
	let editEl: HTMLElement | undefined = $state();

	// Sync when value prop changes externally
	$effect(() => {
		editedValue = value;
		originalValue = value;
		markdownSource = value;
	});

	function startEditing() {
		if (fieldType === 'markdown') {
			markdownSource = editedValue;
			showMarkdownEditor = true;
			return;
		}
		editing = true;
		originalValue = editedValue;
		// Focus the element after Svelte updates the DOM
		requestAnimationFrame(() => {
			if (editEl) {
				editEl.focus();
				// Place cursor at end
				const range = document.createRange();
				const sel = window.getSelection();
				range.selectNodeContents(editEl);
				range.collapse(false);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
		});
	}

	function stopEditing() {
		if (!editing) return;
		editing = false;
		const newText = editEl?.textContent?.trim() ?? '';
		editedValue = newText;
		if (newText !== originalValue) {
			// Submit the hidden form
			requestAnimationFrame(() => formEl?.requestSubmit());
		}
	}

	function cancelEditing() {
		editing = false;
		editedValue = originalValue;
		if (editEl) editEl.textContent = originalValue;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			cancelEditing();
		} else if (e.key === 'Enter' && fieldType === 'short') {
			e.preventDefault();
			stopEditing();
		}
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') ?? '';
		document.execCommand('insertText', false, text);
	}

	function saveMarkdown() {
		editedValue = markdownSource;
		showMarkdownEditor = false;
		if (markdownSource !== originalValue) {
			originalValue = markdownSource;
			requestAnimationFrame(() => formEl?.requestSubmit());
		}
	}

	function cancelMarkdown() {
		markdownSource = editedValue;
		showMarkdownEditor = false;
	}

	function showSaved() {
		saved = true;
		setTimeout(() => (saved = false), 2000);
	}
</script>

<!-- Hidden form for SvelteKit action submission -->
<form
	bind:this={formEl}
	method="POST"
	action="?/update"
	class="hidden"
	use:enhance={() => {
		return async ({ update }) => {
			await update({ reset: false });
			showSaved();
		};
	}}
>
	<input type="hidden" name="slug" value={slug} />
	<input type="hidden" name="section" value={section} />
	{#if clubType}
		<input type="hidden" name="clubType" value={clubType} />
	{/if}
	<input type="hidden" name="body" value={editedValue} />
</form>

<!-- Editable text element -->
{#if fieldType === 'markdown'}
	<!-- Markdown: show rendered HTML, click to open editor overlay -->
	<div class="editable-field group relative" title={label}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="editable-text {className} cursor-pointer rounded transition-all"
			onclick={startEditing}
		>
			{#if editedValue}
				<div class="prose prose-sm max-w-none prose-invert">
					{@html renderMarkdown(editedValue)}
				</div>
			{:else}
				<span class="opacity-40 italic">{placeholder}</span>
			{/if}
		</div>

		<!-- Edit indicator -->
		<div class="edit-indicator">
			<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
			</svg>
		</div>

		<!-- Saved indicator -->
		{#if saved}
			<div class="saved-indicator">Saved</div>
		{/if}
	</div>

	<!-- Markdown editor overlay -->
	{#if showMarkdownEditor}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick={(e) => { if (e.target === e.currentTarget) cancelMarkdown(); }}>
			<div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
				<div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
					<h3 class="text-sm font-semibold text-gray-800">{label || section}</h3>
					<button onclick={cancelMarkdown} class="text-gray-400 hover:text-gray-600 text-lg">&times;</button>
				</div>
				<div class="flex-1 overflow-auto p-4 space-y-3">
					<textarea
						class="w-full h-40 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
						bind:value={markdownSource}
						placeholder="Enter markdown..."
					></textarea>
					<div class="text-xs text-gray-500 font-medium">Preview:</div>
					<div class="p-3 bg-gray-50 rounded-md border border-gray-200 prose prose-sm max-w-none min-h-[60px]">
						{@html renderMarkdown(markdownSource)}
					</div>
				</div>
				<div class="flex justify-end gap-2 px-4 py-3 border-t border-gray-200">
					<button
						onclick={cancelMarkdown}
						class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
					>
						Cancel
					</button>
					<button
						onclick={saveMarkdown}
						class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<!-- Short / Long: inline contenteditable -->
	<div class="editable-field group relative inline" title={label}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<svelte:element
			this={tag}
			bind:this={editEl}
			class="editable-text {className} rounded transition-all {editing ? 'editable-active' : ''}"
			contenteditable={editing}
			role={editing ? 'textbox' : 'button'}
			tabindex="0"
			onclick={() => !editing && startEditing()}
			onblur={stopEditing}
			onkeydown={handleKeydown}
			onpaste={handlePaste}
		>
			{#if editedValue}
				{editedValue}
			{:else if !editing}
				<span class="opacity-40 italic">{placeholder}</span>
			{/if}
		</svelte:element>

		<!-- Edit indicator -->
		{#if !editing}
			<div class="edit-indicator">
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
				</svg>
			</div>
		{/if}

		<!-- Saved indicator -->
		{#if saved}
			<div class="saved-indicator">Saved</div>
		{/if}
	</div>
{/if}

<style>
	.editable-field {
		position: relative;
	}

	.editable-text {
		outline: 2px dashed transparent;
		outline-offset: 4px;
		transition: outline-color 0.15s ease, background-color 0.15s ease;
	}

	.editable-field:hover .editable-text:not(.editable-active) {
		outline-color: rgba(99, 102, 241, 0.5);
		background-color: rgba(99, 102, 241, 0.05);
	}

	.editable-text.editable-active {
		outline: 2px solid rgba(99, 102, 241, 0.8);
		background-color: rgba(99, 102, 241, 0.08);
		cursor: text;
	}

	.edit-indicator {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #4f46e5;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transform: scale(0.8);
		transition: opacity 0.15s ease, transform 0.15s ease;
		pointer-events: none;
		z-index: 10;
	}

	.editable-field:hover .edit-indicator {
		opacity: 1;
		transform: scale(1);
	}

	.saved-indicator {
		position: absolute;
		top: -8px;
		right: -8px;
		padding: 2px 8px;
		border-radius: 9999px;
		background: #059669;
		color: white;
		font-size: 11px;
		font-weight: 600;
		z-index: 10;
		animation: fade-in-out 2s ease forwards;
	}

	@keyframes fade-in-out {
		0% { opacity: 0; transform: translateY(4px); }
		10% { opacity: 1; transform: translateY(0); }
		80% { opacity: 1; }
		100% { opacity: 0; }
	}
</style>
