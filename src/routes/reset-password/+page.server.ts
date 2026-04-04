import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { validatePasswordResetToken, hashPassword } from '$lib/server/auth';
import { passwordResetSchema } from '$lib/utils/validation';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming } from '$lib/server/security';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		throw redirect(303, '/forgot-password');
	}
	return { token };
};

export const actions: Actions = {
	reset: async (event) => {
		const rateLimited = checkRateLimit(event, 'auth-moderate');
		if (rateLimited) return rateLimited;

		const { request } = event;
		const formData = await request.formData();

		const honeypotFail = checkHoneypot(formData);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(formData);
		if (timingFail) return timingFail;

		const data = {
			token: formData.get('token') as string,
			password: formData.get('password') as string
		};

		const parsed = passwordResetSchema.safeParse(data);
		if (!parsed.success) {
			const firstError = parsed.error.issues[0]?.message || 'Invalid input';
			return fail(400, { error: firstError });
		}

		const result = await validatePasswordResetToken(parsed.data.token);
		if (!result) {
			return fail(400, { error: 'Invalid or expired reset link. Please request a new one.' });
		}

		const passwordHash = await hashPassword(parsed.data.password);
		await db
			.update(members)
			.set({ passwordHash, updatedAt: new Date() })
			.where(eq(members.id, result.memberId));

		return { success: true };
	}
};
