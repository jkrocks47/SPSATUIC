import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { announcements } from '$lib/server/db/schema';
import { announcementSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allAnnouncements = await db
		.select()
		.from(announcements)
		.orderBy(desc(announcements.createdAt));

	return { announcements: allAnnouncements };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();

		const data = {
			title: (formData.get('title') as string)?.trim(),
			body: (formData.get('body') as string)?.trim(),
			clubType: (formData.get('clubType') as string) || undefined,
			isPinned: formData.get('isPinned') === 'on',
			publishAt: formData.get('publishAt') as string || undefined,
			expiresAt: formData.get('expiresAt') as string || undefined
		};

		const parsed = announcementSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: parsed.error.errors[0]?.message || 'Invalid input' });
		}

		await db.insert(announcements).values({
			title: parsed.data.title,
			body: parsed.data.body,
			clubType: parsed.data.clubType as 'astronomy' | 'physics' | undefined,
			isPinned: parsed.data.isPinned,
			publishAt: parsed.data.publishAt ? new Date(parsed.data.publishAt) : null,
			expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
			createdBy: locals.member?.id
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID required.' });

		await db.delete(announcements).where(eq(announcements.id, id));
		return { success: true };
	},

	togglePin: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID required.' });

		const result = await db
			.select({ isPinned: announcements.isPinned })
			.from(announcements)
			.where(eq(announcements.id, id))
			.limit(1);

		if (result.length === 0) return fail(404, { error: 'Not found.' });

		await db
			.update(announcements)
			.set({ isPinned: !result[0].isPinned, updatedAt: new Date() })
			.where(eq(announcements.id, id));

		return { success: true };
	}
};
