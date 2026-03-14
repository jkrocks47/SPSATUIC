import { eq, asc, desc, and, gte, lte, or, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, galleryImages, announcements } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const now = new Date();

		const [upcomingEvents, recentImages, activeAnnouncements, content] = await Promise.all([
			db
				.select()
				.from(events)
				.where(and(eq(events.clubType, 'physics'), eq(events.isPublished, true)))
				.orderBy(asc(events.date))
				.limit(3),
			db
				.select()
				.from(galleryImages)
				.where(eq(galleryImages.clubType, 'physics'))
				.orderBy(desc(galleryImages.uploadDate))
				.limit(6),
			db
				.select({
					id: announcements.id,
					title: announcements.title,
					body: announcements.body,
					isPinned: announcements.isPinned
				})
				.from(announcements)
				.where(
					and(
						or(eq(announcements.clubType, 'physics'), isNull(announcements.clubType)),
						or(isNull(announcements.publishAt), lte(announcements.publishAt, now)),
						or(isNull(announcements.expiresAt), gte(announcements.expiresAt, now))
					)
				)
				.orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
				.limit(5),
			getContentWithDefaults('physics', 'home')
		]);

		return {
			events: upcomingEvents,
			images: recentImages,
			announcements: activeAnnouncements,
			content
		};
	} catch (e) {
		console.error('Failed to load physics data:', e);
		return {
			events: [],
			images: [],
			announcements: [],
			content: {} as Record<string, string>
		};
	}
};
