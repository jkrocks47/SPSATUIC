import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { db } from '$lib/server/db';
import { images } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export interface UploadResult {
	url: string;
	thumbnailUrl: string;
	groupId: string;
	width: number;
	height: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'];

export async function processAndStoreImage(file: File): Promise<UploadResult> {
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(
			`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 25MB.`
		);
	}

	if (file.type && !ALLOWED_TYPES.includes(file.type)) {
		throw new Error(
			`Unsupported file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF, TIFF.`
		);
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Process full-size version
	const fullResult = await sharp(buffer)
		.resize(2400, 2400, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 82, effort: 4 })
		.toBuffer({ resolveWithObject: true });

	// Process thumbnail version
	const thumbResult = await sharp(buffer)
		.resize(600, 600, { fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 72, effort: 4 })
		.toBuffer({ resolveWithObject: true });

	const groupId = randomUUID();

	// Store both variants in a transaction
	await db.transaction(async (tx) => {
		await tx.insert(images).values({
			data: fullResult.data,
			mimeType: 'image/webp',
			variant: 'full',
			groupId,
			width: fullResult.info.width,
			height: fullResult.info.height,
			sizeBytes: fullResult.info.size
		});
		await tx.insert(images).values({
			data: thumbResult.data,
			mimeType: 'image/webp',
			variant: 'thumbnail',
			groupId,
			width: thumbResult.info.width,
			height: thumbResult.info.height,
			sizeBytes: thumbResult.info.size
		});
	});

	return {
		url: `/api/images/${groupId}`,
		thumbnailUrl: `/api/images/${groupId}?variant=thumbnail`,
		groupId,
		width: fullResult.info.width,
		height: fullResult.info.height
	};
}

export async function deleteImage(groupId: string): Promise<void> {
	await db.delete(images).where(eq(images.groupId, groupId));
}
