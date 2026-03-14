import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';

export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
	const groupId = params.id;
	const variant = url.searchParams.get('variant') || 'full';

	if (variant !== 'full' && variant !== 'thumbnail') {
		throw error(400, 'Invalid variant');
	}

	const result = await db
		.select({ data: images.data, mimeType: images.mimeType })
		.from(images)
		.where(and(eq(images.groupId, groupId), eq(images.variant, variant)))
		.limit(1);

	if (result.length === 0) {
		throw error(404, 'Image not found');
	}

	const image = result[0];

	setHeaders({
		'Content-Type': image.mimeType,
		'Cache-Control': 'public, max-age=31536000, immutable',
		ETag: `"${groupId}-${variant}"`
	});

	return new Response(image.data);
};
