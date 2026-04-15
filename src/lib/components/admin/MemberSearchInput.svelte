<script lang="ts">
	interface Member {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
	}

	let {
		members,
		selectedId = ''
	}: {
		members: Member[];
		selectedId?: string;
	} = $props();

	// Find the pre-selected member (for edit forms)
	const initial = members.find((m) => m.id === selectedId);

	let chosenId = $state(selectedId);
	let query = $state(initial ? `${initial.firstName} ${initial.lastName}` : '');
	let open = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);

	const chosen = $derived(members.find((m) => m.id === chosenId) ?? null);

	const filtered = $derived.by(() => {
		if (!query.trim()) return members.slice(0, 8);
		const q = query.toLowerCase();
		return members
			.filter(
				(m) =>
					`${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
					m.email.toLowerCase().includes(q)
			)
			.slice(0, 8);
	});

	function select(m: Member) {
		chosenId = m.id;
		query = `${m.firstName} ${m.lastName}`;
		open = false;
	}

	function clear() {
		chosenId = '';
		query = '';
		open = false;
		inputEl?.focus();
	}

	function onFocus() {
		// If nothing is chosen yet, open immediately
		if (!chosenId) open = true;
	}

	function onInput() {
		// Typing while a member is chosen = start a new search
		if (chosenId) chosenId = '';
		open = true;
	}

	function onBlur(e: FocusEvent) {
		// Delay so clicks on dropdown items register before we close
		setTimeout(() => {
			const active = document.activeElement;
			if (!active?.closest('.member-search-wrap')) {
				open = false;
				// If user typed something but didn't pick — restore display or clear
				if (!chosenId) query = '';
				else query = `${chosen?.firstName} ${chosen?.lastName}`;
			}
		}, 150);
	}
</script>

<div class="member-search-wrap">
	<!-- Hidden input carries the memberId value for the form submission -->
	<input type="hidden" name="memberId" value={chosenId} />

	<div class="search-field" class:has-value={!!chosenId}>
		<input
			bind:this={inputEl}
			type="text"
			class="search-input"
			placeholder="Search by name or email…"
			autocomplete="off"
			bind:value={query}
			onfocus={onFocus}
			oninput={onInput}
			onblur={onBlur}
		/>
		{#if chosenId}
			<button type="button" class="clear-btn" onclick={clear} tabindex="-1" aria-label="Clear selection">
				&times;
			</button>
		{/if}
	</div>

	{#if open}
		<ul class="dropdown" role="listbox">
			{#if filtered.length === 0}
				<li class="no-results">No members found</li>
			{:else}
				{#each filtered as m}
					<li
						role="option"
						aria-selected={m.id === chosenId}
						class="option"
						class:selected={m.id === chosenId}
						onmousedown={() => select(m)}
					>
						<span class="option-name">{m.firstName} {m.lastName}</span>
						<span class="option-email">{m.email}</span>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>

<style>
	.member-search-wrap {
		position: relative;
		width: 100%;
	}

	.search-field {
		display: flex;
		align-items: center;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		background: #fff;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.search-field:focus-within {
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.search-input {
		flex: 1;
		padding: 0.5rem 0.65rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #374151;
		background: transparent;
		outline: none;
		min-width: 0;
	}

	.search-input::placeholder {
		color: #9ca3af;
	}

	.clear-btn {
		flex-shrink: 0;
		padding: 0 0.6rem;
		background: none;
		border: none;
		color: #9ca3af;
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
		transition: color 0.15s;
	}

	.clear-btn:hover {
		color: #374151;
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 3px);
		left: 0;
		right: 0;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		list-style: none;
		margin: 0;
		padding: 0.25rem 0;
		z-index: 50;
		max-height: 220px;
		overflow-y: auto;
	}

	.option {
		display: flex;
		flex-direction: column;
		padding: 0.45rem 0.75rem;
		cursor: pointer;
		transition: background 0.1s;
	}

	.option:hover,
	.option.selected {
		background: #f5f3ff;
	}

	.option-name {
		font-size: 0.85rem;
		font-weight: 500;
		color: #111827;
	}

	.option-email {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.no-results {
		padding: 0.6rem 0.75rem;
		font-size: 0.85rem;
		color: #9ca3af;
	}
</style>
