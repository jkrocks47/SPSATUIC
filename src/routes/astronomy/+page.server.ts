import type { PageServerLoad } from './$types';
import { eq, and, gte, lte, desc, asc, or, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, galleryImages, announcements } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';

export const load: PageServerLoad = async () => {
	try {
		const today = new Date().toISOString().split('T')[0];
		const now = new Date();

		const [upcomingEvents, latestGalleryImages, activeAnnouncements, content] = await Promise.all([
			db
				.select({
					id: events.id,
					title: events.title,
					date: events.date,
					time: events.time,
					location: events.location,
					imageUrl: events.imageUrl
				})
				.from(events)
				.where(
					and(
						eq(events.clubType, 'astronomy'),
						eq(events.isPublished, true),
						gte(events.date, today)
					)
				)
				.orderBy(asc(events.date))
				.limit(3),
			db
				.select({
					id: galleryImages.id,
					url: galleryImages.url,
					thumbnailUrl: galleryImages.thumbnailUrl,
					caption: galleryImages.caption,
					photographer: galleryImages.photographer,
					width: galleryImages.width,
					height: galleryImages.height,
					raCoord: galleryImages.raCoord,
					decCoord: galleryImages.decCoord,
					exposureTime: galleryImages.exposureTime,
					equipment: galleryImages.equipment,
					iso: galleryImages.iso,
					aperture: galleryImages.aperture,
					observationDate: galleryImages.observationDate
				})
				.from(galleryImages)
				.where(eq(galleryImages.clubType, 'astronomy'))
				.orderBy(desc(galleryImages.uploadDate))
				.limit(10),
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
						or(eq(announcements.clubType, 'astronomy'), isNull(announcements.clubType)),
						or(isNull(announcements.publishAt), lte(announcements.publishAt, now)),
						or(isNull(announcements.expiresAt), gte(announcements.expiresAt, now))
					)
				)
				.orderBy(desc(announcements.isPinned), desc(announcements.createdAt))
				.limit(5),
			getContentWithDefaults('astronomy', 'home')
		]);

		return {
			upcomingEvents,
			galleryImages: latestGalleryImages,
			announcements: activeAnnouncements,
			content
		};
	} catch (e) {
		console.error('Failed to load astronomy data:', e);
		return {
			upcomingEvents: [],
			galleryImages: [],
			announcements: [],
			content: {} as Record<string, string>
		};
	}
};
