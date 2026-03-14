import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, events, eventRsvps, eventCheckins } from '$lib/server/db/schema';
import { ACTIVE_MEMBER_THRESHOLD } from '$lib/utils/constants';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const member = locals.member!;
	const now = new Date().toISOString().split('T')[0];

	// Count events attended this semester (approximate: last 6 months)
	const semesterStart = new Date();
	semesterStart.setMonth(semesterStart.getMonth() - 6);

	const [attendedResult] = await db
		.select({ count: sql<number>`count(*)` })
		.from(eventCheckins)
		.where(
			and(
				eq(eventCheckins.memberId, member.id),
				gte(eventCheckins.checkedInAt, semesterStart)
			)
		);
	const eventsAttended = Number(attendedResult?.count ?? 0);

	// Upcoming RSVP'd events
	const upcomingRsvps = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			time: events.time,
			location: events.location,
			clubType: events.clubType,
			rsvpStatus: eventRsvps.status
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.where(
			and(
				eq(eventRsvps.memberId, member.id),
				gte(events.date, now),
				eq(events.isPublished, true)
			)
		)
		.orderBy(events.date)
		.limit(5);

	// Member interests and review status
	const [memberData] = await db
		.select({
			eventPreferences: members.eventPreferences,
			preferencesReviewedAt: members.preferencesReviewedAt
		})
		.from(members)
		.where(eq(members.id, member.id))
		.limit(1);

	// Recent check-ins
	const recentCheckins = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			clubType: events.clubType,
			checkedInAt: eventCheckins.checkedInAt
		})
		.from(eventCheckins)
		.innerJoin(events, eq(eventCheckins.eventId, events.id))
		.where(eq(eventCheckins.memberId, member.id))
		.orderBy(desc(eventCheckins.checkedInAt))
		.limit(5);

	// Check if preferences need review (>4 months since last review or never reviewed)
	const fourMonthsAgo = new Date();
	fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
	const needsPreferenceReview = !memberData?.preferencesReviewedAt ||
		memberData.preferencesReviewedAt < fourMonthsAgo;

	return {
		eventsAttended,
		activeThreshold: ACTIVE_MEMBER_THRESHOLD,
		upcomingRsvps,
		recentCheckins,
		eventPreferences: memberData?.eventPreferences ?? [],
		needsPreferenceReview,
		isVerified: member.emailVerified
	};
};
