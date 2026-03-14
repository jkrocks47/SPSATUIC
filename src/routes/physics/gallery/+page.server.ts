import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [images, content] = await Promise.all([
		db
			.select()
			.from(galleryImages)
			.where(eq(galleryImages.clubType, 'physics'))
			.orderBy(desc(galleryImages.uploadDate)),
		getContentWithDefaults('physics', 'gallery')
	]);

	return { images, content };
};
