<script lang="ts">
	import { enhance } from '$app/forms';
	let { form, data } = $props();
</script>

<svelte:head>
	<title>Contact | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">{data.content['page-subtitle'] ?? 'Reach out'}</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				{data.content['page-title'] ?? 'Contact'}
			</h1>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Contact Info -->
			<div class="flex flex-col gap-4">
				<div class="bg-white rounded-2xl border border-gray-100 p-6">
					<h3 class="font-display text-lg font-bold text-physics-dark mb-4">{data.content['contact-heading'] ?? 'Get in Touch'}</h3>
					<div class="space-y-4">
						<div>
							<p class="font-body text-xs text-physics-dark/40 uppercase tracking-wider mb-1">Email</p>
							<a href="mailto:{data.clubInfo?.contactEmail ?? 'sps@uic.edu'}" class="font-body text-sm text-physics-blue hover:text-physics-blue/80 transition-colors no-underline">
								{data.clubInfo?.contactEmail ?? 'sps@uic.edu'}
							</a>
						</div>
						<div>
							<p class="font-body text-xs text-physics-dark/40 uppercase tracking-wider mb-1">Location</p>
							<p class="font-body text-sm text-physics-dark/60">
								University of Illinois at Chicago<br />
								Chicago, IL 60607
							</p>
						</div>
					</div>
				</div>

				<div class="bg-white rounded-2xl border border-gray-100 p-6">
					<h3 class="font-display text-lg font-bold text-physics-dark mb-4">Follow Us</h3>
					<div class="flex gap-4">
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
						>
							Instagram
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
						>
							Twitter
						</a>
						<a
							href="https://discord.gg"
							target="_blank"
							rel="noopener noreferrer"
							class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
						>
							Discord
						</a>
					</div>
				</div>
			</div>

			<!-- Contact Form -->
			<div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
				{#if form?.success}
					<div class="text-center py-8">
						<p class="font-display text-xl font-bold text-physics-dark mb-2">Message Sent</p>
						<p class="font-body text-sm text-physics-dark/60">
							Thank you for reaching out. We will get back to you soon.
						</p>
					</div>
				{:else}
					<h3 class="font-display text-lg font-bold text-physics-dark mb-6">{data.content['form-heading'] ?? 'Send a Message'}</h3>

					{#if form?.error}
						<div class="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 font-body text-sm">
							{form.error}
						</div>
					{/if}

					<form method="POST" use:enhance class="space-y-5">
						<div>
							<label for="name" class="font-body text-xs text-physics-dark/40 uppercase tracking-wider block mb-2">
								Name
							</label>
							<input
								id="name"
								type="text"
								name="name"
								required
								class="w-full bg-physics-light border border-gray-200 rounded-lg px-4 py-3 font-body text-sm text-physics-dark placeholder:text-physics-dark/20 focus:outline-none focus:border-physics-blue/50 transition-colors"
								placeholder="Your name"
							/>
						</div>
						<div>
							<label for="email" class="font-body text-xs text-physics-dark/40 uppercase tracking-wider block mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								name="email"
								required
								class="w-full bg-physics-light border border-gray-200 rounded-lg px-4 py-3 font-body text-sm text-physics-dark placeholder:text-physics-dark/20 focus:outline-none focus:border-physics-blue/50 transition-colors"
								placeholder="you@example.com"
							/>
						</div>
						<div>
							<label for="message" class="font-body text-xs text-physics-dark/40 uppercase tracking-wider block mb-2">
								Message
							</label>
							<textarea
								id="message"
								name="message"
								required
								rows="5"
								class="w-full bg-physics-light border border-gray-200 rounded-lg px-4 py-3 font-body text-sm text-physics-dark placeholder:text-physics-dark/20 focus:outline-none focus:border-physics-blue/50 transition-colors resize-none"
								placeholder="What would you like to know?"
							></textarea>
						</div>
						<button
							type="submit"
							class="w-full inline-flex items-center justify-center px-8 py-3 bg-physics-blue text-white font-body text-sm font-medium rounded-full hover:bg-physics-blue/90 transition-colors cursor-pointer border-0"
						>
							Send Message
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>
