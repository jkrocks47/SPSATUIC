import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		return { valid: false, optedOut: false, token: null };
	}

	const result = await db
		.select({ id: members.id, emailOptOut: members.emailOptOut })
		.from(members)
		.where(eq(members.unsubscribeToken, token))
		.limit(1);

	if (result.length === 0) {
		return { valid: false, optedOut: false, token };
	}

	return { valid: true, optedOut: result[0].emailOptOut, token };
};

export const actions: Actions = {
	unsubscribe: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;

		if (!token) return fail(400, { error: 'Missing token.' });

		const result = await db
			.update(members)
			.set({ emailOptOut: true, updatedAt: new Date() })
			.where(eq(members.unsubscribeToken, token))
			.returning({ id: members.id });

		if (result.length === 0) return fail(400, { error: 'Invalid token.' });

		return { unsubscribed: true };
	},

	resubscribe: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;

		if (!token) return fail(400, { error: 'Missing token.' });

		const result = await db
			.update(members)
			.set({ emailOptOut: false, updatedAt: new Date() })
			.where(eq(members.unsubscribeToken, token))
			.returning({ id: members.id });

		if (result.length === 0) return fail(400, { error: 'Invalid token.' });

		return { resubscribed: true };
	}
};
