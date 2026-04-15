import { fail } from '@sveltejs/kit';

/**
 * Checks hidden honeypot fields that real users never fill.
 * Bots auto-filling by field name will populate these, revealing themselves.
 * Returns fail(400) if bot detected, null if clean.
 */
export function checkHoneypot(formData: FormData) {
	const hpf1 = formData.get('_hpf1');
	const hpf2 = formData.get('_hpf2');

	if ((hpf1 && String(hpf1).length > 0) || (hpf2 && String(hpf2).length > 0)) {
		return fail(400, { error: 'Something went wrong. Please try again.' });
	}

	return null;
}
