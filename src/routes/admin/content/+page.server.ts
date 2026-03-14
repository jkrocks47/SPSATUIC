import { fail, redirect } from '@sveltejs/kit';
import { getContentWithDefaults, upsertContent, getRootEntries } from '$lib/server/content';
import { getPageGroups } from '$lib/utils/content-registry';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Only super_admin can edit root homepage content
	if (locals.member?.adminRole !== 'super_admin') {
		throw redirect(302, '/admin');
	}

	const content = await getContentWithDefaults(null, 'root-home');

	return {
		contentBySlug: { 'root-home': content },
		entries: getRootEntries(),
		pageGroups: getPageGroups(false)
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		if (locals.member?.adminRole !== 'super_admin') {
			return fail(403, { error: 'Unauthorized.' });
		}

		const formData = await request.formData();
		const slug = formData.get('slug') as string;
		const section = formData.get('section') as string;
		const body = formData.get('body') as string;

		if (!slug || !section) {
			return fail(400, { error: 'Slug and section are required.' });
		}

		await upsertContent(slug, null, section, { body }, locals.member!.id);
		return { success: true };
	}
};
