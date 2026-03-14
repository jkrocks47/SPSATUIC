import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { clubInfo } from '$lib/server/db/schema';
import { getContentWithDefaults, upsertContent, getClubEntries } from '$lib/server/content';
import { getPageGroups } from '$lib/utils/content-registry';
import type { Actions, PageServerLoad } from './$types';

const CLUB = 'physics' as const;

export const load: PageServerLoad = async () => {
	const [content, clubInfoResult] = await Promise.all([
		getContentWithDefaults(CLUB, 'home'),
		db.select().from(clubInfo).where(eq(clubInfo.clubType, CLUB)).limit(1)
	]);

	// Auto-create club_info row if it doesn't exist
	let clubInfoRow = clubInfoResult[0] ?? null;
	if (!clubInfoRow) {
		const inserted = await db.insert(clubInfo).values({ clubType: CLUB }).returning();
		clubInfoRow = inserted[0];
	}

	// Load content for all slugs, keyed by slug to avoid section-name collisions
	const slugs = [...new Set(getClubEntries().map((e) => e.slug))];

	const contentResults = await Promise.all(
		slugs.map((slug) => getContentWithDefaults(CLUB, slug))
	);

	const contentBySlug: Record<string, Record<string, string>> = {};
	for (let i = 0; i < slugs.length; i++) {
		contentBySlug[slugs[i]] = contentResults[i];
	}

	return {
		contentBySlug,
		clubInfo: clubInfoRow,
		entries: getClubEntries(),
		pageGroups: getPageGroups(true)
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const slug = formData.get('slug') as string;
		const section = formData.get('section') as string;
		const body = formData.get('body') as string;

		if (!slug || !section) {
			return fail(400, { error: 'Slug and section are required.' });
		}

		await upsertContent(slug, CLUB, section, { body }, locals.member!.id);
		return { success: true };
	},

	updateClubInfo: async ({ request }) => {
		const formData = await request.formData();
		const field = formData.get('field') as string;
		const value = formData.get('value') as string;

		if (field === 'socialLinks') {
			const links: Record<string, string> = {};
			let i = 0;
			while (formData.has(`socialKey_${i}`)) {
				const key = (formData.get(`socialKey_${i}`) as string).trim();
				const val = (formData.get(`socialValue_${i}`) as string).trim();
				if (key && val) {
					links[key] = val;
				}
				i++;
			}

			await db
				.update(clubInfo)
				.set({ socialLinks: links, updatedAt: new Date() })
				.where(eq(clubInfo.clubType, CLUB));
		} else if (['aboutText', 'meetingInfo', 'contactEmail'].includes(field)) {
			await db
				.update(clubInfo)
				.set({ [field]: value || null, updatedAt: new Date() })
				.where(eq(clubInfo.clubType, CLUB));
		} else {
			return fail(400, { error: 'Invalid field.' });
		}

		return { success: true };
	}
};
