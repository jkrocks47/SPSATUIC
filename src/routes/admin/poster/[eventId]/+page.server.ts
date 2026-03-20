import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const event = await db
		.select()
		.from(events)
		.where(eq(events.id, params.eventId))
		.limit(1);

	if (event.length === 0) {
		throw error(404, 'Event not found');
	}

	const e = event[0];

	if (!e.checkinCode) {
		throw error(400, 'This event does not have a check-in code');
	}

	const origin = url.origin;
	const checkinUrl = `${origin}/checkin/${e.id}?code=${e.checkinCode}`;

	return {
		event: {
			id: e.id,
			title: e.title,
			description: e.description,
			date: e.date,
			time: e.time,
			location: e.location,
			clubType: e.clubType
		},
		checkinUrl
	};
};
