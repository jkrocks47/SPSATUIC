import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { profileUpdateSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;

	const result = await db
		.select({
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			year: members.year,
			major: members.major,
			astronomyMember: members.astronomyMember,
			physicsMember: members.physicsMember,
			eventPreferences: members.eventPreferences
		})
		.from(members)
		.where(eq(members.id, member.id))
		.limit(1);

	return { profile: result[0] };
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const member = locals.member!;
		const formData = await request.formData();

		const data = {
			firstName: (formData.get('firstName') as string)?.trim(),
			lastName: (formData.get('lastName') as string)?.trim(),
			year: (formData.get('year') as string) || undefined,
			major: (formData.get('major') as string)?.trim() || undefined,
			astronomyMember: formData.get('astronomyMember') === 'on',
			physicsMember: formData.get('physicsMember') === 'on',
			eventPreferences: formData.getAll('eventPreferences') as string[]
		};

		const parsed = profileUpdateSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: parsed.error.errors[0]?.message || 'Invalid input' });
		}

		if (!parsed.data.astronomyMember && !parsed.data.physicsMember) {
			return fail(400, { error: 'Please select at least one club.' });
		}

		await db
			.update(members)
			.set({
				firstName: parsed.data.firstName,
				lastName: parsed.data.lastName,
				displayName: `${parsed.data.firstName} ${parsed.data.lastName}`,
				year: parsed.data.year || null,
				major: parsed.data.major || null,
				astronomyMember: parsed.data.astronomyMember,
				physicsMember: parsed.data.physicsMember,
				eventPreferences: parsed.data.eventPreferences || [],
				preferencesReviewedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(members.id, member.id));

		return { success: true };
	}
};
