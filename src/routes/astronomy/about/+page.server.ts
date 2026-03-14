import { eq, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { clubInfo, officers } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [infoResult, officersList, content] = await Promise.all([
		db.select().from(clubInfo).where(eq(clubInfo.clubType, 'astronomy')).limit(1),
		db.select().from(officers).where(eq(officers.clubType, 'astronomy')).orderBy(asc(officers.sortOrder)),
		getContentWithDefaults('astronomy', 'about')
	]);

	return {
		clubInfo: infoResult[0] ?? null,
		officers: officersList,
		content
	};
};
