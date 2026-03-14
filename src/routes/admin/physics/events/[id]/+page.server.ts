import { error } from '@sveltejs/kit';
import { getEventDetailForAdmin } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getEventDetailForAdmin(params.id, 'physics');

	if (!result) {
		error(404, 'Event not found.');
	}

	return {
		event: result.event,
		rsvpList: result.rsvpList,
		stats: result.stats,
		historicalRate: result.historicalRate
	};
};
