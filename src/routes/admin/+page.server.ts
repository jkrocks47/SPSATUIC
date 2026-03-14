import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { verifyPassword, createMemberSession, destroyMemberSession } from '$lib/server/auth';
import { loginSchema } from '$lib/utils/validation';
import { getInterestBreakdown, getMembershipStats } from '$lib/server/db/queries';
import { EVENT_PREFERENCES } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.member?.adminRole) {
		return { member: locals.member };
	}

	const [interestResult, membershipStats] = await Promise.all([
		getInterestBreakdown(),
		getMembershipStats()
	]);

	const interestMap = new Map(interestResult.interests.map((i) => [i.preference, i]));
	const allInterests = EVENT_PREFERENCES.map((pref) =>
		interestMap.get(pref) ?? { preference: pref, total: 0, astronomyCount: 0, physicsCount: 0 }
	);

	return {
		member: locals.member,
		interestBreakdown: allInterests,
		membershipStats
	};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		const parsed = loginSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const { email, password } = parsed.data;

		const result = await db
			.select()
			.from(members)
			.where(eq(members.email, email.toLowerCase().trim()))
			.limit(1);

		if (result.length === 0) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const member = result[0];

		if (!member.adminRole) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const valid = await verifyPassword(password, member.passwordHash);

		if (!valid) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const token = await createMemberSession(member.id);

		cookies.set('member_session', token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		throw redirect(303, '/admin');
	},

	logout: async ({ cookies }) => {
		const token = cookies.get('member_session');
		if (token) {
			await destroyMemberSession(token);
			cookies.delete('member_session', { path: '/' });
		}
		throw redirect(303, '/admin');
	}
};
