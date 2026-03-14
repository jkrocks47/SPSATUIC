import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';
import { getBoardEmails } from '$lib/server/db/queries';
import { getContentWithDefaults } from '$lib/server/content';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { clubInfo } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const [content, clubInfoResult] = await Promise.all([
		getContentWithDefaults('physics', 'contact'),
		db.select().from(clubInfo).where(eq(clubInfo.clubType, 'physics')).limit(1)
	]);
	return { content, clubInfo: clubInfoResult[0] ?? null };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString()?.trim();
		const email = data.get('email')?.toString()?.trim();
		const message = data.get('message')?.toString()?.trim();

		if (!name || !email || !message) {
			return fail(400, { error: 'All fields are required.' });
		}

		try {
			const recipientEmails = await getBoardEmails('physics');
			await sendContactEmail(name, email, message, recipientEmails);
			return { success: true };
		} catch (err) {
			console.error('Failed to send contact email:', err);
			return fail(500, { error: 'Failed to send message. Please try again later.' });
		}
	}
};
