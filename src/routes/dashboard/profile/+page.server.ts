import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members } from '$lib/server/db/schema';
import { profileUpdateSchema } from '$lib/utils/validation';
import { processAndStoreImage, deleteImage } from '$lib/server/images';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;

	const result = await db
		.select({
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			secondaryEmail: members.secondaryEmail,
			year: members.year,
			major: members.major,
			astronomyMember: members.astronomyMember,
			physicsMember: members.physicsMember,
			eventPreferences: members.eventPreferences,
			emailOptOut: members.emailOptOut,
			profileImageUrl: members.profileImageUrl,
			role: members.role
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
			secondaryEmail: (formData.get('secondaryEmail') as string)?.trim() || undefined,
			year: (formData.get('year') as string) || undefined,
			major: (formData.get('major') as string)?.trim() || undefined,
			astronomyMember: formData.get('astronomyMember') === 'on',
			physicsMember: formData.get('physicsMember') === 'on',
			eventPreferences: formData.getAll('eventPreferences') as string[],
			emailOptOut: formData.get('emailOptOut') === 'on'
		};

		const parsed = profileUpdateSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: parsed.error.issues[0]?.message || 'Invalid input' });
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
				secondaryEmail: parsed.data.secondaryEmail || null,
				year: parsed.data.year || null,
				major: parsed.data.major || null,
				astronomyMember: parsed.data.astronomyMember,
				physicsMember: parsed.data.physicsMember,
				eventPreferences: parsed.data.eventPreferences || [],
				emailOptOut: parsed.data.emailOptOut ?? false,
				preferencesReviewedAt: new Date(),
				updatedAt: new Date()
			})
			.where(eq(members.id, member.id));

		return { success: true };
	},

	uploadPhoto: async ({ request, locals }) => {
		const member = locals.member!;
		const formData = await request.formData();
		const file = formData.get('photo') as File | null;

		if (!file || file.size === 0) {
			return fail(400, { photoError: 'Please select an image to upload.' });
		}

		try {
			// Delete old profile image if one exists
			const current = await db
				.select({ profileImageUrl: members.profileImageUrl })
				.from(members)
				.where(eq(members.id, member.id))
				.limit(1);

			if (current[0]?.profileImageUrl) {
				const oldGroupId = current[0].profileImageUrl.replace('/api/images/', '').split('?')[0];
				await deleteImage(oldGroupId);
			}

			const result = await processAndStoreImage(file);

			await db
				.update(members)
				.set({
					profileImageUrl: result.url,
					updatedAt: new Date()
				})
				.where(eq(members.id, member.id));

			return { photoSuccess: true };
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Failed to upload image.';
			return fail(400, { photoError: message });
		}
	},

	removePhoto: async ({ locals }) => {
		const member = locals.member!;

		const current = await db
			.select({ profileImageUrl: members.profileImageUrl })
			.from(members)
			.where(eq(members.id, member.id))
			.limit(1);

		if (current[0]?.profileImageUrl) {
			const groupId = current[0].profileImageUrl.replace('/api/images/', '').split('?')[0];
			await deleteImage(groupId);
		}

		await db
			.update(members)
			.set({
				profileImageUrl: null,
				updatedAt: new Date()
			})
			.where(eq(members.id, member.id));

		return { photoRemoved: true };
	}
};
