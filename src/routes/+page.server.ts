import type { PageServerLoad } from './$types';
import { eq, and, gte, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, clubInfo, officers } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const today = new Date().toISOString().split('T')[0];

		const [upcomingEvents, spsInfoResult, spsOfficers, content] = await Promise.all([
			db
				.select({
					id: events.id,
					title: events.title,
					description: events.description,
					date: events.date,
					time: events.time,
					location: events.location,
					clubType: events.clubType,
					imageUrl: events.imageUrl
				})
				.from(events)
				.where(and(eq(events.isPublished, true), gte(events.date, today)))
				.orderBy(asc(events.date))
				.limit(20),
			db
				.select()
				.from(clubInfo)
				.where(eq(clubInfo.clubType, 'physics'))
				.limit(1),
			db
				.select()
				.from(officers)
				.where(eq(officers.clubType, 'physics'))
				.orderBy(asc(officers.sortOrder)),
			getContentWithDefaults(null, 'root-home')
		]);

		return {
			upcomingEvents,
			spsInfo: spsInfoResult[0] ?? null,
			spsOfficers,
			isLoggedIn: !!locals.member,
			isVerified: locals.member?.emailVerified ?? false,
			member: locals.member,
			content
		};
	} catch (e) {
		console.error('Failed to load homepage data:', e);
		return { upcomingEvents: [], spsInfo: null, spsOfficers: [], isLoggedIn: false, isVerified: false, member: null, content: {} as Record<string, string> };
	}
};
