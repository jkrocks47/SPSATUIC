import type { PageServerLoad } from './$types';
import { eq, and, gte, lte, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { isPastEvent } from '$lib/utils/dates';

export const load: PageServerLoad = async () => {
	const now = new Date();
	const yearStart = `${now.getFullYear()}-01-01`;
	const yearEnd = `${now.getFullYear()}-12-31`;

	const allEvents = await db
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
		.where(
			and(
				eq(events.isPublished, true),
				gte(events.date, yearStart),
				lte(events.date, yearEnd)
			)
		)
		.orderBy(asc(events.date));

	const upcomingEvents = allEvents.filter((e) => !isPastEvent(e.date));
	const pastEvents = allEvents.filter((e) => isPastEvent(e.date)).reverse();

	return { allEvents, upcomingEvents, pastEvents, year: now.getFullYear() };
};
