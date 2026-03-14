import { fail } from '@sveltejs/kit';
import { eq, desc, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { galleryImages } from '$lib/server/db/schema';
import { galleryImageSchema } from '$lib/utils/validation';
import { processAndStoreImage, deleteImage } from '$lib/server/images';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const images = await db
		.select()
		.from(galleryImages)
		.where(eq(galleryImages.clubType, 'astronomy'))
		.orderBy(desc(galleryImages.uploadDate));

	return { images };
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const formData = await request.formData();
		const imageFile = formData.get('image') as File | null;

		if (!imageFile || imageFile.size === 0) {
			return fail(400, { error: 'Please select an image to upload.' });
		}

		const data = {
			caption: (formData.get('caption') as string) || undefined,
			photographer: (formData.get('photographer') as string) || undefined,
			clubType: 'astronomy' as const,
			raCoord: (formData.get('raCoord') as string) || undefined,
			decCoord: (formData.get('decCoord') as string) || undefined,
			exposureTime: (formData.get('exposureTime') as string) || undefined,
			equipment: (formData.get('equipment') as string) || undefined,
			iso: (formData.get('iso') as string) || undefined,
			aperture: (formData.get('aperture') as string) || undefined,
			observationDate: (formData.get('observationDate') as string) || undefined
		};

		const parsed = galleryImageSchema.safeParse(data);
		if (!parsed.success) {
			return fail(400, { error: 'Invalid data.' });
		}

		let uploadResult;
		try {
			uploadResult = await processAndStoreImage(imageFile);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			console.error('Gallery upload failed:', message);
			return fail(500, { error: `Failed to upload image: ${message}` });
		}

		await db.insert(galleryImages).values({
			url: uploadResult.url,
			thumbnailUrl: uploadResult.thumbnailUrl,
			imageGroupId: uploadResult.groupId,
			caption: parsed.data.caption || null,
			clubType: 'astronomy',
			photographer: parsed.data.photographer || null,
			width: uploadResult.width,
			height: uploadResult.height,
			raCoord: parsed.data.raCoord || null,
			decCoord: parsed.data.decCoord || null,
			exposureTime: parsed.data.exposureTime || null,
			equipment: parsed.data.equipment || null,
			iso: parsed.data.iso || null,
			aperture: parsed.data.aperture || null,
			observationDate: parsed.data.observationDate || null,
			uploadedBy: locals.member?.id
		});

		return { success: true, action: 'upload' };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Image ID is required.' });
		}

		try {
			const result = await db
				.select()
				.from(galleryImages)
				.where(and(eq(galleryImages.id, id), eq(galleryImages.clubType, 'astronomy')))
				.limit(1);

			if (result.length === 0) {
				return fail(404, { error: 'Image not found.' });
			}

			const image = result[0];

			try {
				await deleteImage(image.imageGroupId);
			} catch {
				// Continue with deletion even if image cleanup fails
			}

			await db
				.delete(galleryImages)
				.where(and(eq(galleryImages.id, id), eq(galleryImages.clubType, 'astronomy')));
		} catch (err) {
			console.error('Gallery delete failed:', err);
			return fail(500, { error: 'Failed to delete image.' });
		}

		return { success: true, action: 'delete' };
	}
};
