import { error } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventRsvps } from '$lib/server/db/schema';
import { isPastEvent } from '$lib/utils/dates';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await db
		.select()
		.from(events)
		.where(and(eq(events.id, params.id), eq(events.clubType, 'astronomy'), eq(events.isPublished, true)))
		.limit(1);

	if (result.length === 0) {
		error(404, 'Event not found');
	}

	const isPast = isPastEvent(result[0].date);

	// Skip RSVP queries for past events
	if (isPast) {
		return {
			event: result[0],
			isPast,
			rsvpCounts: { going: 0, maybe: 0, not_going: 0 },
			memberRsvp: null,
			isLoggedIn: !!locals.member,
			isVerified: locals.member?.emailVerified ?? false
		};
	}

	// Load RSVP counts
	const rsvpCounts = await db
		.select({
			status: eventRsvps.status,
			count: sql<number>`count(*)`
		})
		.from(eventRsvps)
		.where(eq(eventRsvps.eventId, params.id))
		.groupBy(eventRsvps.status);

	const counts = { going: 0, maybe: 0, not_going: 0 };
	for (const row of rsvpCounts) {
		counts[row.status] = Number(row.count);
	}

	// Load member's RSVP status if logged in
	let memberRsvp: string | null = null;
	if (locals.member) {
		const rsvpResult = await db
			.select({ status: eventRsvps.status })
			.from(eventRsvps)
			.where(
				and(eq(eventRsvps.eventId, params.id), eq(eventRsvps.memberId, locals.member.id))
			)
			.limit(1);
		memberRsvp = rsvpResult[0]?.status ?? null;
	}

	return {
		event: result[0],
		isPast,
		rsvpCounts: counts,
		memberRsvp,
		isLoggedIn: !!locals.member,
		isVerified: locals.member?.emailVerified ?? false
	};
};
