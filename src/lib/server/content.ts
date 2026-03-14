import { eq, and, isNull } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { pageContent } from '$lib/server/db/schema';
import { contentEntries, clubDefaults, type ContentEntry } from '$lib/utils/content-registry';

export interface ContentBlock {
	title?: string | null;
	body?: string | null;
	metadata?: Record<string, unknown> | null;
}

/**
 * Load all pageContent rows for a given slug + clubType from the DB.
 * Returns a Map keyed by section name.
 */
export async function getPageContent(
	clubType: string | null,
	slug: string
): Promise<Map<string, ContentBlock>> {
	const condition = clubType
		? and(eq(pageContent.slug, slug), eq(pageContent.clubType, clubType as 'astronomy' | 'physics'))
		: and(eq(pageContent.slug, slug), isNull(pageContent.clubType));

	const rows = await db
		.select({
			section: pageContent.section,
			title: pageContent.title,
			body: pageContent.body,
			metadata: pageContent.metadata
		})
		.from(pageContent)
		.where(condition);

	const map = new Map<string, ContentBlock>();
	for (const row of rows) {
		map.set(row.section, { title: row.title, body: row.body, metadata: row.metadata });
	}
	return map;
}

/**
 * Load content for a page, merging DB values with defaults from the registry.
 * Returns a plain object keyed by section name with string body values.
 */
export async function getContentWithDefaults(
	clubType: string | null,
	slug: string
): Promise<Record<string, string>> {
	const dbContent = await getPageContent(clubType, slug);
	const result: Record<string, string> = {};

	// Get all entries for this slug
	const entries = contentEntries.filter((e) => e.slug === slug);

	for (const entry of entries) {
		const dbBlock = dbContent.get(entry.section);
		if (dbBlock?.body) {
			result[entry.section] = dbBlock.body;
		} else {
			// Fall back to club-specific defaults, then entry defaults
			const key = `${slug}|${entry.section}`;
			const clubDef = clubType ? clubDefaults[key]?.[clubType] : undefined;
			result[entry.section] = clubDef?.defaultBody ?? entry.defaultBody ?? '';
		}
	}

	return result;
}

/**
 * Upsert a pageContent row. Uses the unique constraint on (slug, clubType, section).
 */
export async function upsertContent(
	slug: string,
	clubType: string | null,
	section: string,
	data: { title?: string; body?: string },
	updatedBy: string
): Promise<void> {
	const values = {
		slug,
		clubType: clubType as 'astronomy' | 'physics' | null,
		section,
		title: data.title ?? null,
		body: data.body ?? null,
		updatedBy,
		updatedAt: new Date()
	};

	await db
		.insert(pageContent)
		.values(values)
		.onConflictDoUpdate({
			target: [pageContent.slug, pageContent.clubType, pageContent.section],
			set: {
				title: values.title,
				body: values.body,
				updatedBy: values.updatedBy,
				updatedAt: values.updatedAt
			}
		});
}

/**
 * Get all content entries relevant to a club (club-specific entries only).
 */
export function getClubEntries(): ContentEntry[] {
	return contentEntries.filter((e) => e.clubSpecific);
}

/**
 * Get all root homepage entries (not club-specific).
 */
export function getRootEntries(): ContentEntry[] {
	return contentEntries.filter((e) => !e.clubSpecific);
}
