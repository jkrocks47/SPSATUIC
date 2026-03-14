import { getContentWithDefaults } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const content = await getContentWithDefaults('physics', 'join');
	return { content };
};
