import { fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { announcements } from '$lib/server/db/schema';
import { announcementSchema } from '$lib/utils/validation';
import { canManageClub } from '$lib/utils/constants';
import type { ClubType } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

/** Check if admin role can manage an announcement's clubType (null = both clubs, super_admin only) */
function canManageAnnouncement(adminRole: string | null, clubType: string | null): boolean {
	if (!adminRole) return false;
	if (adminRole === 'super_admin') return true;
	if (!clubType) return false; // "Both Clubs" announcements require super_admin
	return canManageClub(adminRole as any, clubType as ClubType);
}

export const load: PageServerLoad = async ({ parent }) => {
	const { currentUser } = await parent();
	const role = currentUser?.adminRole;

	let filter;
	if (role === 'astronomy_admin') {
		filter = eq(announcements.clubType, 'astronomy');
	} else if (role === 'physics_admin') {
		filter = eq(announcements.clubType, 'physics');
	}
	// super_admin sees all — no filter

	const allAnnouncements = await db
		.select()
		.from(announcements)
		.where(filter)
		.orderBy(desc(announcements.createdAt));

	return { announcements: allAnnouncements };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const adminRole = locals.member?.adminRole;

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
			return fail(400, { error: parsed.error.issues[0]?.message || 'Invalid input' });
		}

		// Enforce club-specific permissions
		if (!canManageAnnouncement(adminRole ?? null, parsed.data.clubType ?? null)) {
			return fail(403, { error: 'You do not have permission to post announcements for this club.' });
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

	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID required.' });

		// Fetch announcement to check club ownership
		const result = await db
			.select({ clubType: announcements.clubType })
			.from(announcements)
			.where(eq(announcements.id, id))
			.limit(1);

		if (result.length === 0) return fail(404, { error: 'Not found.' });

		if (!canManageAnnouncement(locals.member?.adminRole ?? null, result[0].clubType)) {
			return fail(403, { error: 'You do not have permission to delete this announcement.' });
		}

		await db.delete(announcements).where(eq(announcements.id, id));
		return { success: true };
	},

	togglePin: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { error: 'ID required.' });

		const result = await db
			.select({ isPinned: announcements.isPinned, clubType: announcements.clubType })
			.from(announcements)
			.where(eq(announcements.id, id))
			.limit(1);

		if (result.length === 0) return fail(404, { error: 'Not found.' });

		if (!canManageAnnouncement(locals.member?.adminRole ?? null, result[0].clubType)) {
			return fail(403, { error: 'You do not have permission to modify this announcement.' });
		}

		await db
			.update(announcements)
			.set({ isPinned: !result[0].isPinned, updatedAt: new Date() })
			.where(eq(announcements.id, id));

		return { success: true };
	}
};
