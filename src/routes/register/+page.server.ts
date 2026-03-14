import { randomBytes } from 'crypto';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import {
	hashPassword,
	createMemberSession,
	generateVerificationToken
} from '$lib/server/auth';
import { sendVerificationEmail } from '$lib/server/email';
import { registrationSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

function safeRedirect(redirectTo: string | null): string {
	if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
		return redirectTo;
	}
	return '/verify-email';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectTo = url.searchParams.get('redirectTo');
	if (locals.member) {
		throw redirect(303, safeRedirect(redirectTo));
	}
	return { redirectTo };
};

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		const redirectTo = formData.get('redirectTo') as string | null;

		const data = {
			email: (formData.get('email') as string)?.toLowerCase().trim(),
			password: formData.get('password') as string,
			firstName: (formData.get('firstName') as string)?.trim(),
			lastName: (formData.get('lastName') as string)?.trim(),
			year: (formData.get('year') as string) || undefined,
			major: (formData.get('major') as string)?.trim() || undefined,
			astronomyMember: formData.get('astronomyMember') === 'on',
			physicsMember: formData.get('physicsMember') === 'on',
			eventPreferences: formData.getAll('eventPreferences') as string[]
		};

		const parsed = registrationSchema.safeParse(data);
		if (!parsed.success) {
			const firstError = parsed.error.errors[0]?.message || 'Invalid input';
			return fail(400, { error: firstError, email: data.email, firstName: data.firstName, lastName: data.lastName });
		}

		if (!parsed.data.astronomyMember && !parsed.data.physicsMember) {
			return fail(400, { error: 'Please select at least one club to join.', email: data.email, firstName: data.firstName, lastName: data.lastName });
		}

		// Check if email already exists
		const existing = await db
			.select({ id: members.id })
			.from(members)
			.where(eq(members.email, parsed.data.email))
			.limit(1);

		if (existing.length > 0) {
			return fail(400, { error: 'An account with this email already exists. Try logging in instead.', email: data.email });
		}

		const passwordHash = await hashPassword(parsed.data.password);
		const displayName = `${parsed.data.firstName} ${parsed.data.lastName}`;

		const [member] = await db
			.insert(members)
			.values({
				email: parsed.data.email,
				passwordHash,
				firstName: parsed.data.firstName,
				lastName: parsed.data.lastName,
				displayName,
				year: parsed.data.year || null,
				major: parsed.data.major || null,
				astronomyMember: parsed.data.astronomyMember,
				physicsMember: parsed.data.physicsMember,
				eventPreferences: parsed.data.eventPreferences || [],
			unsubscribeToken: randomBytes(32).toString('hex')
			})
			.returning({ id: members.id });

		// Generate verification token and send email
		const token = await generateVerificationToken(member.id);
		try {
			await sendVerificationEmail(parsed.data.email, token, parsed.data.firstName);
		} catch {
			// Don't fail registration if email fails — they can request a new one
		}

		// Create session
		const sessionToken = await createMemberSession(member.id);
		cookies.set('member_session', sessionToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, safeRedirect(redirectTo));
	}
};
