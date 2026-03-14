import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { officers, members } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [boardMembers, content] = await Promise.all([
		db
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
				memberProfileImage: members.profileImageUrl,
				memberYear: members.year,
				memberMajor: members.major
			})
			.from(officers)
			.leftJoin(members, eq(officers.memberId, members.id))
			.where(eq(officers.clubType, 'astronomy'))
			.orderBy(asc(officers.sortOrder)),
		getContentWithDefaults('astronomy', 'board')
	]);

	return { boardMembers, content };
};
