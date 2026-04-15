<script lang="ts">
	let {
		challenge = '',
		difficulty = 16,
		onReady
	}: {
		challenge?: string;
		difficulty?: number;
		onReady?: (ready: boolean) => void;
	} = $props();

	let tsValue = $state('');
	let powNonce = $state('');

	$effect(() => {
		// Set timestamp on mount — measures how long the user has the form open
		tsValue = Date.now().toString();
	});

	$effect(() => {
		// Proof-of-work: only runs if a challenge is provided
		if (!challenge) return;

		// Reset state for the new challenge
		powNonce = '';
		onReady?.(false);

		let cancelled = false;
		const target = difficulty;
		const currentChallenge = challenge; // capture so the loop uses the right value

		(async () => {
			// Find a nonce where SHA-256(challenge + ":" + nonce) has `difficulty` leading zero bits
			const encoder = new TextEncoder();
			let counter = 0;

			while (true) {
				if (cancelled) return;

				const input = `${currentChallenge}:${counter}`;
				const data = encoder.encode(input);
				const hashBuffer = await crypto.subtle.digest('SHA-256', data);
				const hashArray = new Uint8Array(hashBuffer);

				if (hasLeadingZeroBits(hashArray, target)) {
					if (!cancelled) {
						powNonce = counter.toString();
						onReady?.(true);
					}
					break;
				}

				counter++;

				// Yield to the main thread every 1000 iterations to keep UI responsive
				if (counter % 1000 === 0) {
					await new Promise((r) => setTimeout(r, 0));
				}
			}
		})();

		// Cleanup: cancel the loop when the challenge prop changes or component unmounts
		return () => {
			cancelled = true;
		};
	});

	function hasLeadingZeroBits(hash: Uint8Array, bits: number): boolean {
		const fullBytes = Math.floor(bits / 8);
		const remainingBits = bits % 8;

		for (let i = 0; i < fullBytes; i++) {
			if (hash[i] !== 0) return false;
		}

		if (remainingBits > 0) {
			const mask = 0xff << (8 - remainingBits);
			if ((hash[fullBytes] & mask) !== 0) return false;
		}

		return true;
	}
</script>

<!-- Honeypot fields: positioned off-screen, invisible to real users, attractive to bots -->
<!-- Using position/opacity instead of display:none because some bots skip display:none fields -->
<div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;" aria-hidden="true">
	<input type="text" name="_name" tabindex="-1" autocomplete="off" />
	<input type="email" name="_email_confirm" tabindex="-1" autocomplete="off" />
</div>

<!-- Timestamp: set on mount to measure form fill duration -->
<input type="hidden" name="_ts" value={tsValue} />

<!-- Proof-of-work fields: only rendered when challenge is provided -->
{#if challenge}
	<input type="hidden" name="_pow_challenge" value={challenge} />
	<input type="hidden" name="_pow_nonce" value={powNonce} />
{/if}
