<script lang="ts">
	let { data } = $props();

	const event = data.event;
	const isAstronomy = event.clubType === 'astronomy';

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=${isAstronomy ? '1a1a2e' : '0d1b2a'}&data=${encodeURIComponent(data.checkinUrl)}`;
</script>

<svelte:head>
	<title>Event Poster - {event.title}</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="poster" class:astronomy={isAstronomy} class:physics={!isAstronomy}>
	<!-- Background effects -->
	<div class="bg-effects">
		<div class="nebula nebula-1"></div>
		<div class="nebula nebula-2"></div>
		<div class="nebula nebula-3"></div>
		<div class="grid-overlay"></div>
		{#each Array(80) as _, i}
			<div
				class="star"
				style="left: {Math.random() * 100}%; top: {Math.random() * 100}%; opacity: {(Math.random() * 0.5 + 0.2).toFixed(2)}; width: {Math.random() * 2 + 1}px; height: {Math.random() * 2 + 1}px;"
			></div>
		{/each}
	</div>

	<!-- Content -->
	<div class="content">
		<!-- Top: Branding -->
		<div class="top-section">
			<div class="org-badge">Society of Physics Students</div>
			<div class="club-badge">
				{#if isAstronomy}
					Astronomy Club
				{:else}
					Physics Club
				{/if}
			</div>
		</div>

		<!-- Event title -->
		<div class="title-section">
			<h1 class="event-title">{event.title}</h1>
			{#if event.description}
				<p class="event-description">{event.description}</p>
			{/if}
		</div>

		<!-- Event details -->
		<div class="details-section">
			<div class="detail-row">
				<span class="detail-icon">&#128197;</span>
				<span class="detail-text">{formatDate(event.date)}</span>
			</div>
			{#if event.time}
				<div class="detail-row">
					<span class="detail-icon">&#128336;</span>
					<span class="detail-text">{event.time}</span>
				</div>
			{/if}
			{#if event.location}
				<div class="detail-row">
					<span class="detail-icon">&#128205;</span>
					<span class="detail-text">{event.location}</span>
				</div>
			{/if}
		</div>

		<!-- QR Code -->
		<div class="qr-section">
			<div class="scan-label">Scan to Check In</div>
			<div class="qr-frame">
				<div class="corner tl"></div>
				<div class="corner tr"></div>
				<div class="corner bl"></div>
				<div class="corner br"></div>
				<div class="qr-code">
					<img src={qrUrl} alt="Check-in QR Code" />
				</div>
			</div>
			<div class="url-label">uicspacetime.org</div>
		</div>

		<!-- Bottom -->
		<div class="bottom-section">
			<div class="cta">
				{#if isAstronomy}
					Look up. Wonder. Join us.
				{:else}
					Question everything. Join us.
				{/if}
			</div>
			<div class="sps-footer">
				<span class="sps-dot"></span>
				UIC Spacetime &bull; Est. 1988
			</div>
		</div>
	</div>

	<!-- Print button (hidden on print) -->
	<button class="print-btn" onclick={() => window.print()}>
		Print Poster
	</button>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #0a0a0f;
	}

	.poster {
		width: 8.5in;
		height: 11in;
		margin: 0 auto;
		position: relative;
		overflow: hidden;
		font-family: 'Space Grotesk', sans-serif;
		color: #ffffff;
	}

	/* Theme: Astronomy */
	.poster.astronomy {
		background: linear-gradient(180deg, #0a0a1a 0%, #1a1040 40%, #0d0d2b 100%);
	}

	.poster.astronomy .nebula-1 {
		background: radial-gradient(circle, #a855f7, transparent 70%);
	}

	.poster.astronomy .nebula-2 {
		background: radial-gradient(circle, #4f46e5, transparent 70%);
	}

	.poster.astronomy .nebula-3 {
		background: radial-gradient(circle, #22d3ee, transparent 70%);
	}

	.poster.astronomy .club-badge {
		color: #c4b5fd;
		border-color: rgba(168, 85, 247, 0.4);
		background: rgba(168, 85, 247, 0.08);
	}

	.poster.astronomy .event-title {
		background: linear-gradient(180deg, #ffffff 0%, #c4b5fd 60%, #a855f7 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.poster.astronomy .scan-label {
		color: #a855f7;
	}

	.poster.astronomy .corner {
		border-color: #7c3aed;
	}

	.poster.astronomy .cta {
		color: #fbbf24;
	}

	.poster.astronomy .grid-overlay {
		background-image:
			linear-gradient(rgba(168, 85, 247, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(168, 85, 247, 0.04) 1px, transparent 1px);
	}

	/* Theme: Physics */
	.poster.physics {
		background: linear-gradient(180deg, #060e18 0%, #0d1b2a 40%, #0a1520 100%);
	}

	.poster.physics .nebula-1 {
		background: radial-gradient(circle, #CE1126, transparent 70%);
	}

	.poster.physics .nebula-2 {
		background: radial-gradient(circle, #1b2838, transparent 70%);
	}

	.poster.physics .nebula-3 {
		background: radial-gradient(circle, #E63946, transparent 70%);
	}

	.poster.physics .club-badge {
		color: #E63946;
		border-color: rgba(206, 17, 38, 0.4);
		background: rgba(206, 17, 38, 0.08);
	}

	.poster.physics .event-title {
		background: linear-gradient(180deg, #ffffff 0%, #fca5a5 60%, #E63946 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.poster.physics .scan-label {
		color: #E63946;
	}

	.poster.physics .corner {
		border-color: #CE1126;
	}

	.poster.physics .cta {
		color: #fbbf24;
	}

	.poster.physics .grid-overlay {
		background-image:
			linear-gradient(rgba(206, 17, 38, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(206, 17, 38, 0.04) 1px, transparent 1px);
	}

	/* Background effects */
	.bg-effects {
		position: absolute;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.star {
		position: absolute;
		background: white;
		border-radius: 50%;
	}

	.nebula {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.25;
	}

	.nebula-1 {
		width: 380px;
		height: 380px;
		top: -120px;
		right: -100px;
	}

	.nebula-2 {
		width: 320px;
		height: 320px;
		bottom: -80px;
		left: -80px;
	}

	.nebula-3 {
		width: 200px;
		height: 200px;
		top: 45%;
		left: 50%;
		transform: translate(-50%, -50%);
		opacity: 0.12;
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		background-size: 40px 40px;
	}

	/* Content */
	.content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		text-align: center;
		height: 100%;
		padding: 0.6in 0.65in;
	}

	/* Top branding */
	.top-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.org-badge {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: #8892A4;
		padding: 5px 16px;
		border: 1px solid rgba(136, 146, 164, 0.25);
		border-radius: 4px;
	}

	.club-badge {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 3px;
		text-transform: uppercase;
		padding: 6px 20px;
		border-width: 1px;
		border-style: solid;
		border-radius: 6px;
	}

	/* Title */
	.title-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		max-width: 6.5in;
	}

	.event-title {
		font-family: 'Anton', Impact, sans-serif;
		font-size: 64px;
		line-height: 1;
		letter-spacing: 2px;
		text-transform: uppercase;
		margin: 0;
	}

	.event-description {
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		line-height: 1.6;
		color: #8892A4;
		max-width: 5in;
		margin: 0;
	}

	/* Details */
	.details-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: 'Space Grotesk', sans-serif;
	}

	.detail-icon {
		font-size: 18px;
	}

	.detail-text {
		font-size: 17px;
		font-weight: 500;
		color: #e2e8f0;
	}

	/* QR Code */
	.qr-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	.scan-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 13px;
		letter-spacing: 5px;
		text-transform: uppercase;
		font-weight: 500;
	}

	.qr-frame {
		position: relative;
		padding: 18px;
	}

	.corner {
		position: absolute;
		width: 32px;
		height: 32px;
		border-style: solid;
	}

	.corner.tl { top: 0; left: 0; border-width: 3px 0 0 3px; }
	.corner.tr { top: 0; right: 0; border-width: 3px 3px 0 0; }
	.corner.bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; }
	.corner.br { bottom: 0; right: 0; border-width: 0 3px 3px 0; }

	.qr-code {
		width: 240px;
		height: 240px;
		background: white;
		padding: 14px;
		border-radius: 8px;
	}

	.qr-code img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.url-label {
		font-family: 'JetBrains Mono', monospace;
		font-size: 18px;
		font-weight: 500;
		color: #22d3ee;
		letter-spacing: 2px;
	}

	/* Bottom */
	.bottom-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.cta {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 18px;
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	.sps-footer {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: #8892A4;
	}

	.sps-dot {
		width: 6px;
		height: 6px;
		background: #CE1126;
		border-radius: 50%;
		display: inline-block;
	}

	/* Print button */
	.print-btn {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 100;
		padding: 12px 24px;
		background: #4f46e5;
		color: white;
		border: none;
		border-radius: 8px;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
		transition: background 0.15s;
	}

	.print-btn:hover {
		background: #4338ca;
	}

	/* Print */
	@page {
		size: letter;
		margin: 0;
	}

	@media print {
		:global(body) {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
			background: none !important;
		}

		:global(.sidebar) {
			display: none !important;
		}

		:global(.top-bar) {
			display: none !important;
		}

		:global(.admin-layout) {
			display: block !important;
			background: none !important;
		}

		:global(.main-area) {
			display: block !important;
		}

		:global(.main-area > .content) {
			padding: 0 !important;
			overflow: visible !important;
		}

		.poster {
			margin: 0;
			box-shadow: none;
		}

		.print-btn {
			display: none !important;
		}
	}
</style>
