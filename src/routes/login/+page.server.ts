import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { verifyPassword, createMemberSession } from '$lib/server/auth';
import { memberLoginSchema } from '$lib/utils/validation';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming } from '$lib/server/security';
import type { Actions, PageServerLoad } from './$types';

function safeRedirect(redirectTo: string | null): string {
	if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
		return redirectTo;
	}
	return '/dashboard';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	if (locals.member) {
		throw redirect(303, safeRedirect(redirectTo));
	}
	return { redirectTo };
};

export const actions: Actions = {
	login: async (event) => {
		const rateLimited = checkRateLimit(event, 'auth-strict');
		if (rateLimited) return rateLimited;

		const { request, cookies } = event;
		const formData = await request.formData();

		const honeypotFail = checkHoneypot(formData);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(formData, 0.5);
		if (timingFail) return timingFail;

		const redirectTo = formData.get('redirectTo') as string | null;

		const data = {
			email: (formData.get('email') as string)?.toLowerCase().trim(),
			password: formData.get('password') as string
		};

		const parsed = memberLoginSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid email or password.', email: data.email });
		}

		const result = await db
			.select()
			.from(members)
			.where(eq(members.email, parsed.data.email))
			.limit(1);

		if (result.length === 0) {
			return fail(400, { error: 'Invalid email or password.', email: data.email });
		}

		const member = result[0];
		const valid = await verifyPassword(parsed.data.password, member.passwordHash);

		if (!valid) {
			return fail(400, { error: 'Invalid email or password.', email: data.email });
		}

		const sessionToken = await createMemberSession(member.id);
		cookies.set('member_session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, safeRedirect(redirectTo));
	}
};
