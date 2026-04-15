import { error } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventRsvps } from '$lib/server/db/schema';
import { isPastEvent } from '$lib/utils/dates';
import type { PageServerLoad } from './$types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!UUID_RE.test(params.eventId)) {
		error(404, 'Event not found');
	}

	const result = await db
		.select()
		.from(events)
		.where(and(eq(events.id, params.eventId), eq(events.isPublished, true)))
		.limit(1);

	if (result.length === 0) {
		error(404, 'Event not found');
	}

	const event = result[0];
	const isPast = isPastEvent(event.date);

	if (isPast) {
		return {
			event: {
				id: event.id,
				title: event.title,
				description: event.description,
				date: event.date,
				time: event.time,
				location: event.location,
				locationUrl: event.locationUrl,
				imageUrl: event.imageUrl,
				clubType: event.clubType
			},
			isPast,
			rsvpCounts: { going: 0, maybe: 0, not_going: 0 },
			memberRsvp: null as 'going' | 'maybe' | 'not_going' | null,
			isLoggedIn: !!locals.member,
			isVerified: locals.member?.emailVerified ?? false
		};
	}

	const rsvpCounts = await db
		.select({
			status: eventRsvps.status,
			count: sql<number>`count(*)`
		})
		.from(eventRsvps)
		.where(eq(eventRsvps.eventId, params.eventId))
		.groupBy(eventRsvps.status);

	const counts = { going: 0, maybe: 0, not_going: 0 };
	for (const row of rsvpCounts) {
		counts[row.status] = Number(row.count);
	}

	let memberRsvp: 'going' | 'maybe' | 'not_going' | null = null;
	if (locals.member) {
		const rsvpResult = await db
			.select({ status: eventRsvps.status })
			.from(eventRsvps)
			.where(
				and(eq(eventRsvps.eventId, params.eventId), eq(eventRsvps.memberId, locals.member.id))
			)
			.limit(1);
		memberRsvp = rsvpResult[0]?.status ?? null;
	}

	return {
		event: {
			id: event.id,
			title: event.title,
			description: event.description,
			date: event.date,
			time: event.time,
			location: event.location,
			locationUrl: event.locationUrl,
			imageUrl: event.imageUrl,
			clubType: event.clubType
		},
		isPast,
		rsvpCounts: counts,
		memberRsvp,
		isLoggedIn: !!locals.member,
		isVerified: locals.member?.emailVerified ?? false
	};
};
