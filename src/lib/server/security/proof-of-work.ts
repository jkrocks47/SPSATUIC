import { randomBytes, createHash } from 'crypto';
import { fail } from '@sveltejs/kit';

const CHALLENGE_EXPIRY_SECONDS = 5 * 60; // 5 minutes
const DEFAULT_DIFFICULTY = 16; // 16 leading zero bits ≈ 65,536 expected iterations ≈ 50-200ms

/**
 * Generate a proof-of-work challenge for the client.
 * Returns challenge string and difficulty to embed in the page data.
 * Challenge format: "{timestamp_ms}:{random_hex}"
 */
export function generateChallenge(difficulty = DEFAULT_DIFFICULTY) {
	const timestamp = Date.now();
	const nonce = randomBytes(16).toString('hex');
	return {
		challenge: `${timestamp}:${nonce}`,
		difficulty
	};
}

/**
 * Verify the client's proof-of-work solution.
 * The client must find a nonce such that SHA-256(challenge + ":" + nonce) has
 * `difficulty` leading zero bits.
 *
 * Returns fail(400) if invalid/missing/expired, null if valid.
 */
export async function checkProofOfWork(formData: FormData) {
	const challenge = formData.get('_pow_challenge');
	const nonce = formData.get('_pow_nonce');

	if (!challenge || !nonce || typeof challenge !== 'string' || typeof nonce !== 'string') {
		return fail(400, { error: 'Security verification failed. Please reload and try again.' });
	}

	// Validate challenge format and expiry
	const colonIndex = challenge.indexOf(':');
	if (colonIndex === -1) {
		return fail(400, { error: 'Security verification failed. Please reload and try again.' });
	}

	const timestamp = parseInt(challenge.substring(0, colonIndex), 10);
	if (isNaN(timestamp)) {
		return fail(400, { error: 'Security verification failed. Please reload and try again.' });
	}

	const elapsed = (Date.now() - timestamp) / 1000;
	if (elapsed > CHALLENGE_EXPIRY_SECONDS || elapsed < 0) {
		return fail(400, { error: 'Security challenge expired. Please reload and try again.' });
	}

	// Verify the hash meets the difficulty requirement
	const input = `${challenge}:${nonce}`;
	const hash = createHash('sha256').update(input).digest();

	if (!hasLeadingZeroBits(hash, DEFAULT_DIFFICULTY)) {
		return fail(400, { error: 'Security verification failed. Please reload and try again.' });
	}

	return null;
}

/**
 * Check if a hash buffer has at least `bits` leading zero bits.
 */
function hasLeadingZeroBits(hash: Buffer, bits: number): boolean {
	const fullBytes = Math.floor(bits / 8);
	const remainingBits = bits % 8;

	// Check full zero bytes
	for (let i = 0; i < fullBytes; i++) {
		if (hash[i] !== 0) return false;
	}

	// Check remaining bits in the next byte
	if (remainingBits > 0) {
		const mask = 0xff << (8 - remainingBits);
		if ((hash[fullBytes] & mask) !== 0) return false;
	}

	return true;
}
