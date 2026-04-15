<script lang="ts">
	import { enhance } from '$app/forms';
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';
	import type { ActionData, PageData } from './$types';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	let submitting = $state(false);
</script>

<svelte:head>
	<title>Contact | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">{data.content['page-subtitle'] ?? 'REACH OUT'}</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				{data.content['page-title'] ?? 'CONTACT'}
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Contact Info -->
			<div class="flex flex-col gap-6">
				<GlassPanel class="p-6">
					<h3 class="font-display text-lg font-bold text-astro-cream mb-4">{data.content['contact-heading'] ?? 'Get in Touch'}</h3>
					<div class="space-y-4">
						<div>
							<p class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 mb-1">EMAIL</p>
							<a href="mailto:{data.clubInfo?.contactEmail ?? 'uicastronomyclub@gmail.com'}" class="font-mono text-sm text-astro-cyan hover:text-astro-cyan/80 transition-colors no-underline block">
								{data.clubInfo?.contactEmail ?? 'uicastronomyclub@gmail.com'}
							</a>
						</div>
						<div>
							<p class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 mb-1">LOCATION</p>
							<p class="font-body text-sm text-astro-cream/70">
								University of Illinois at Chicago<br />
								Chicago, IL 60607
							</p>
						</div>
					</div>
				</GlassPanel>

				<GlassPanel class="p-6">
					<h3 class="font-display text-lg font-bold text-astro-cream mb-4">Follow Us</h3>
					<div class="flex gap-4">
						{#if data.clubInfo?.socialLinks && Object.keys(data.clubInfo.socialLinks).length > 0}
							{#each Object.entries(data.clubInfo.socialLinks) as [platform, url]}
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									class="font-mono text-xs tracking-[0.15em] text-astro-cream/50 hover:text-astro-cream transition-colors no-underline"
								>
									{platform.toUpperCase()}
								</a>
							{/each}
						{:else}
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								class="font-mono text-xs tracking-[0.15em] text-astro-cream/50 hover:text-astro-cream transition-colors no-underline"
							>
								INSTAGRAM
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								class="font-mono text-xs tracking-[0.15em] text-astro-cream/50 hover:text-astro-cream transition-colors no-underline"
							>
								TWITTER
							</a>
							<a
								href="https://discord.gg"
								target="_blank"
								rel="noopener noreferrer"
								class="font-mono text-xs tracking-[0.15em] text-astro-cream/50 hover:text-astro-cream transition-colors no-underline"
							>
								DISCORD
							</a>
						{/if}
					</div>
				</GlassPanel>
			</div>

			<!-- Contact Form -->
			<GlassPanel class="p-6 sm:p-8">
				{#if form?.success}
					<div class="text-center py-8">
						<p class="font-display text-xl font-bold text-astro-cream mb-2">Message Sent</p>
						<p class="font-body text-sm text-astro-cream/60">
							Thank you for reaching out. We will get back to you soon.
						</p>
					</div>
				{:else}
					<h3 class="font-display text-lg font-bold text-astro-cream mb-6">{data.content['form-heading'] ?? 'Send a Message'}</h3>

					{#if form?.error}
						<div class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
							<p class="font-body text-sm text-red-400">{form.error}</p>
						</div>
					{/if}

					<form method="POST" use:enhance class="space-y-5" onsubmit={() => submitting = true}>
						<BotProtection challenge={data.challenge} difficulty={data.difficulty} />
						<div>
							<label for="name" class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 block mb-2">
								NAME
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-astro-cream placeholder:text-astro-cream/20 focus:outline-none focus:border-astro-indigo/50 transition-colors"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label for="email" class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 block mb-2">
								EMAIL
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-astro-cream placeholder:text-astro-cream/20 focus:outline-none focus:border-astro-indigo/50 transition-colors"
								placeholder="you@example.com"
							/>
						</div>
						<div>
							<label for="message" class="font-mono text-[10px] tracking-[0.2em] text-astro-cream/40 block mb-2">
								MESSAGE
							</label>
							<textarea
								id="message"
								name="message"
								required
								rows="5"
								class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body text-sm text-astro-cream placeholder:text-astro-cream/20 focus:outline-none focus:border-astro-indigo/50 transition-colors resize-none"
								placeholder="What would you like to know?"
							></textarea>
						</div>
						<button type="submit" class="pill-btn w-full justify-center" disabled={submitting}>
							{submitting ? 'SENDING...' : 'SEND MESSAGE'}
						</button>
					</form>
				{/if}
			</GlassPanel>
		</div>
	</div>
</section>
