import { fail, redirect } from '@sveltejs/kit';
import { checkVerificationToken, validateVerificationToken, generateVerificationToken, destroyMemberSession } from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const token = url.searchParams.get('token');

	if (token) {
		// Read-only check — don't consume the token on GET.
		// Outlook Safe Links and other email scanners prefetch URLs,
		// which would ghost-verify users and consume the token.
		const valid = await checkVerificationToken(token);
		if (valid) {
			return { tokenValid: true, token };
		}

		// Token not found — may have been consumed already.
		// Check if the logged-in user is already verified.
		if (locals.member) {
			const [fresh] = await db
				.select({ emailVerified: members.emailVerified })
				.from(members)
				.where(eq(members.id, locals.member.id))
				.limit(1);

			if (fresh?.emailVerified) {
				return { verified: true };
			}
		}

		return { error: 'Invalid or expired verification link.' };
	}

	if (locals.member?.emailVerified) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	verify: async ({ request }) => {
		const formData = await request.formData();
		const token = formData.get('token') as string;

		if (!token) {
			return fail(400, { verifyError: 'Missing verification token.' });
		}

		const result = await validateVerificationToken(token);
		if (!result) {
			return fail(400, { verifyError: 'Invalid or expired verification link.' });
		}

		return { verified: true };
	},
	resend: async ({ locals }) => {
		if (!locals.member) {
			return fail(401, { resendError: 'You must be signed in to resend the verification email.' });
		}

		if (locals.member.emailVerified) {
			return fail(400, { resendError: 'Your email is already verified.' });
		}

		const member = await db
			.select({ id: members.id, email: members.email, firstName: members.firstName })
			.from(members)
			.where(eq(members.id, locals.member.id))
			.limit(1);

		if (member.length === 0) {
			return fail(400, { resendError: 'Account not found.' });
		}

		try {
			const token = await generateVerificationToken(member[0].id);
			await sendVerificationEmail(member[0].email, token, member[0].firstName);
		} catch {
			return fail(500, { resendError: 'Failed to send email. Please try again.' });
		}

		return { resent: true };
	},
	logout: async ({ cookies }) => {
		const token = cookies.get('member_session');
		if (token) {
			await destroyMemberSession(token);
			cookies.delete('member_session', { path: '/' });
		}
		throw redirect(303, '/');
	}
};
