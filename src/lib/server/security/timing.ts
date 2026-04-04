import { fail } from '@sveltejs/kit';

/**
 * Validates the hidden timestamp field to detect bot submissions.
 * Real users take at least a few seconds to fill a form; bots submit instantly.
 * Rejects if: field missing, malformed, in the future, or elapsed time < minSeconds.
 */
export function checkSubmissionTiming(formData: FormData, minSeconds = 2) {
	const tsRaw = formData.get('_ts');

	if (!tsRaw || typeof tsRaw !== 'string') {
		return fail(400, { error: 'Something went wrong. Please try again.' });
	}

	const ts = parseInt(tsRaw, 10);

	if (isNaN(ts)) {
		return fail(400, { error: 'Something went wrong. Please try again.' });
	}

	const now = Date.now();

	// Reject future timestamps (tampered)
	if (ts > now + 1000) {
		return fail(400, { error: 'Something went wrong. Please try again.' });
	}

	const elapsedSeconds = (now - ts) / 1000;

	if (elapsedSeconds < minSeconds) {
		return fail(400, { error: 'Please take a moment to fill out the form.' });
	}

	return null;
}
