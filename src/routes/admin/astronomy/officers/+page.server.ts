import { fail } from '@sveltejs/kit';
import { eq, asc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers, members } from '$lib/server/db/schema';
import { officerSchema } from '$lib/utils/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const officersList = await db
		.select({
			id: officers.id,
			name: officers.name,
			position: officers.position,
			bio: officers.bio,
			imageUrl: officers.imageUrl,
			email: officers.email,
			sortOrder: officers.sortOrder,
			academicYear: officers.academicYear,
			memberId: officers.memberId,
			memberFirstName: members.firstName,
			memberLastName: members.lastName,
			memberEmail: members.email,
			memberProfileImage: members.profileImageUrl
		})
		.from(officers)
		.leftJoin(members, eq(officers.memberId, members.id))
		.where(eq(officers.clubType, 'astronomy'))
		.orderBy(asc(officers.sortOrder));

	// Get all members for the linking dropdown
	const allMembers = await db
		.select({
			id: members.id,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			profileImageUrl: members.profileImageUrl
		})
		.from(members)
		.where(eq(members.astronomyMember, true));

	return { officers: officersList, members: allMembers };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const data = {
			name: formData.get('name') as string,
			position: formData.get('position') as string,
			email: (formData.get('email') as string) || '',
			bio: (formData.get('bio') as string) || '',
			clubType: 'astronomy' as const,
			sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
			academicYear: (formData.get('academicYear') as string) || '',
			memberId: (formData.get('memberId') as string) || ''
		};

		const parsed = officerSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid officer data. Please check all required fields.' });
		}

		await db.insert(officers).values({
			name: parsed.data.name,
			position: parsed.data.position,
			email: parsed.data.email || null,
			bio: parsed.data.bio || null,
			clubType: 'astronomy',
			sortOrder: parsed.data.sortOrder,
			academicYear: parsed.data.academicYear || null,
			memberId: parsed.data.memberId || null
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Officer ID is required.' });

		const data = {
			name: formData.get('name') as string,
			position: formData.get('position') as string,
			email: (formData.get('email') as string) || '',
			bio: (formData.get('bio') as string) || '',
			clubType: 'astronomy' as const,
			sortOrder: formData.get('sortOrder') ? Number(formData.get('sortOrder')) : 0,
			academicYear: (formData.get('academicYear') as string) || '',
			memberId: (formData.get('memberId') as string) || ''
		};

		const parsed = officerSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid officer data.' });
		}

		await db
			.update(officers)
			.set({
				name: parsed.data.name,
				position: parsed.data.position,
				email: parsed.data.email || null,
				bio: parsed.data.bio || null,
				sortOrder: parsed.data.sortOrder,
				academicYear: parsed.data.academicYear || null,
				memberId: parsed.data.memberId || null
			})
			.where(and(eq(officers.id, id), eq(officers.clubType, 'astronomy')));

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'Officer ID is required.' });

		await db
			.delete(officers)
			.where(and(eq(officers.id, id), eq(officers.clubType, 'astronomy')));

		return { success: true };
	}
};
