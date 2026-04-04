import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';
import { getBoardEmails } from '$lib/server/db/queries';
import { getContentWithDefaults } from '$lib/server/content';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming, generateChallenge, checkProofOfWork } from '$lib/server/security';

export const load: PageServerLoad = async () => {
	const content = await getContentWithDefaults('astronomy', 'contact');
	const pow = generateChallenge();
	return { content, challenge: pow.challenge, difficulty: pow.difficulty };
};

export const actions: Actions = {
	default: async (event) => {
		const rateLimited = checkRateLimit(event, 'contact');
		if (rateLimited) return rateLimited;

		const { request } = event;
		const data = await request.formData();

		const honeypotFail = checkHoneypot(data);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(data);
		if (timingFail) return timingFail;

		const powFail = await checkProofOfWork(data);
		if (powFail) return powFail;
		const name = data.get('name')?.toString()?.trim();
		const email = data.get('email')?.toString()?.trim();
		const message = data.get('message')?.toString()?.trim();

		if (!name || !email || !message) {
			return fail(400, { error: 'All fields are required.' });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.' });
		}

		try {
			const recipientEmails = await getBoardEmails('astronomy');
			await sendContactEmail(name, email, message, recipientEmails);
			return { success: true };
		} catch (err) {
			console.error('Failed to send contact email:', err);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
};
