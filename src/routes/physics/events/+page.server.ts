import { eq, asc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { isPastEvent } from '$lib/utils/dates';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [allEvents, content] = await Promise.all([
		db
			.select()
			.from(events)
			.where(and(eq(events.clubType, 'physics'), eq(events.isPublished, true)))
			.orderBy(asc(events.date)),
		getContentWithDefaults('physics', 'events')
	]);

	const upcomingEvents = allEvents.filter((e) => !isPastEvent(e.date));
	const pastEvents = allEvents.filter((e) => isPastEvent(e.date)).reverse();

	return { upcomingEvents, pastEvents, content };
};
