import { eq, and, sql, inArray, desc } from 'drizzle-orm';
import { db } from './index';
import { officers, events, eventRsvps, eventCheckins, members, eventAnnouncementLogs, interestOptions, clubInfo } from './schema';
import { CONTACT_EMAILS } from '$lib/utils/constants';
import type { ClubType } from '$lib/utils/constants';

export async function getBoardEmails(clubType: ClubType): Promise<string[]> {
	const [boardOfficers, clubInfoResult] = await Promise.all([
		db.select({ email: officers.email }).from(officers).where(eq(officers.clubType, clubType)),
		db.select({ contactEmail: clubInfo.contactEmail }).from(clubInfo).where(eq(clubInfo.clubType, clubType)).limit(1)
	]);

	const officerEmails = boardOfficers
		.map((o) => o.email)
		.filter((e): e is string => !!e);

	const clubContactEmail = clubInfoResult[0]?.contactEmail;
	const baseEmails = clubContactEmail ? [clubContactEmail] : CONTACT_EMAILS;

	return [...new Set([...baseEmails, ...officerEmails])];
}

// --- Interest Options ---

export async function getInterestOptions(): Promise<string[]> {
	const rows = await db
		.select({ name: interestOptions.name })
		.from(interestOptions)
		.orderBy(interestOptions.sortOrder);
	return rows.map((r) => r.name);
}

// --- Event Analytics Queries ---

export interface RsvpMemberDetail {
	memberId: string;
	firstName: string;
	lastName: string;
	email: string;
	status: string;
	checkedIn: boolean;
	reliabilityScore: number | null;
}

export interface EventStats {
	going: number;
	maybe: number;
	notGoing: number;
	checkedIn: number;
	estimatedTurnout: number;
}

/**
 * Get RSVP list with member details for a specific event
 */
export async function getEventRsvpList(eventId: string): Promise<RsvpMemberDetail[]> {
	const rsvps = await db
		.select({
			memberId: eventRsvps.memberId,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			status: eventRsvps.status,
			checkinId: eventCheckins.id
		})
		.from(eventRsvps)
		.innerJoin(members, eq(eventRsvps.memberId, members.id))
		.leftJoin(
			eventCheckins,
			and(
				eq(eventRsvps.eventId, eventCheckins.eventId),
				eq(eventRsvps.memberId, eventCheckins.memberId)
			)
		)
		.where(eq(eventRsvps.eventId, eventId));

	if (rsvps.length === 0) return [];

	const memberIds = rsvps.map((r) => r.memberId);
	const scores = await getMemberReliabilityScores(memberIds);

	return rsvps.map((r) => ({
		memberId: r.memberId,
		firstName: r.firstName,
		lastName: r.lastName,
		email: r.email,
		status: r.status,
		checkedIn: r.checkinId !== null,
		reliabilityScore: scores.get(r.memberId) ?? null
	}));
}

/**
 * Compute reliability scores for a set of members.
 * Reliability = (check-ins for events where member RSVP'd "going" and event is past) / (total "going" RSVPs for past events)
 */
export async function getMemberReliabilityScores(
	memberIds: string[]
): Promise<Map<string, number>> {
	if (memberIds.length === 0) return new Map();

	const rows = await db
		.select({
			memberId: eventRsvps.memberId,
			totalGoing: sql<number>`count(*)::int`,
			actualCheckins: sql<number>`count(${eventCheckins.id})::int`
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.leftJoin(
			eventCheckins,
			and(
				eq(eventRsvps.eventId, eventCheckins.eventId),
				eq(eventRsvps.memberId, eventCheckins.memberId)
			)
		)
		.where(
			and(
				inArray(eventRsvps.memberId, memberIds),
				eq(eventRsvps.status, 'going'),
				sql`${events.date} < CURRENT_DATE`
			)
		)
		.groupBy(eventRsvps.memberId);

	const scoreMap = new Map<string, number>();
	for (const row of rows) {
		if (row.totalGoing > 0) {
			scoreMap.set(row.memberId, row.actualCheckins / row.totalGoing);
		}
	}
	return scoreMap;
}

/**
 * Estimate turnout for an event based on RSVP'd members' reliability.
 * Going members contribute their reliability score (default 0.5 for new members).
 * Maybe members contribute reliability * 0.3.
 */
export async function getEstimatedTurnout(eventId: string): Promise<number> {
	const rsvps = await db
		.select({
			memberId: eventRsvps.memberId,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.where(
			and(eq(eventRsvps.eventId, eventId), sql`${eventRsvps.status} IN ('going', 'maybe')`)
		);

	if (rsvps.length === 0) return 0;

	const memberIds = rsvps.map((r) => r.memberId);
	const scores = await getMemberReliabilityScores(memberIds);

	const DEFAULT_RELIABILITY = 0.5;
	const MAYBE_WEIGHT = 0.3;

	let estimated = 0;
	for (const rsvp of rsvps) {
		const reliability = scores.get(rsvp.memberId) ?? DEFAULT_RELIABILITY;
		if (rsvp.status === 'going') {
			estimated += reliability;
		} else if (rsvp.status === 'maybe') {
			estimated += reliability * MAYBE_WEIGHT;
		}
	}

	return Math.round(estimated * 10) / 10;
}

/**
 * Historical turnout rate: average (check-ins / going RSVPs) across past events for a club.
 * Only includes events that had at least one "going" RSVP.
 */
export async function getHistoricalTurnoutRate(clubType: ClubType): Promise<number | null> {
	const rows = await db
		.select({
			eventId: events.id,
			goingCount: sql<number>`(SELECT count(*) FROM event_rsvps WHERE event_id = ${events.id} AND status = 'going')::int`,
			checkinCount: sql<number>`(SELECT count(*) FROM event_checkins WHERE event_id = ${events.id})::int`
		})
		.from(events)
		.where(and(eq(events.clubType, clubType), sql`${events.date} < CURRENT_DATE`));

	const eventsWithGoingRsvps = rows.filter((r) => r.goingCount > 0);
	if (eventsWithGoingRsvps.length === 0) return null;

	const totalRate = eventsWithGoingRsvps.reduce(
		(sum, r) => sum + r.checkinCount / r.goingCount,
		0
	);
	return Math.round((totalRate / eventsWithGoingRsvps.length) * 100);
}

/**
 * Load full event detail for admin: event data, RSVP list, stats, and turnout metrics.
 */
export async function getEventDetailForAdmin(eventId: string, clubType: ClubType) {
	const eventResult = await db
		.select()
		.from(events)
		.where(and(eq(events.id, eventId), eq(events.clubType, clubType)))
		.limit(1);

	if (eventResult.length === 0) return null;

	const event = eventResult[0];
	const rsvpList = await getEventRsvpList(eventId);
	const estimatedTurnout = await getEstimatedTurnout(eventId);
	const historicalRate = await getHistoricalTurnoutRate(clubType);

	// Compute stats from rsvpList and get check-in responses
	const checkins = await db
		.select({
			memberId: eventCheckins.memberId,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			responses: eventCheckins.questionResponses,
			checkedInAt: eventCheckins.checkedInAt
		})
		.from(eventCheckins)
		.innerJoin(members, eq(eventCheckins.memberId, members.id))
		.where(eq(eventCheckins.eventId, eventId));

	const stats: EventStats = {
		going: rsvpList.filter((r) => r.status === 'going').length,
		maybe: rsvpList.filter((r) => r.status === 'maybe').length,
		notGoing: rsvpList.filter((r) => r.status === 'not_going').length,
		checkedIn: checkins.length,
		estimatedTurnout
	};

	return { event, rsvpList, stats, historicalRate, checkinResponses: checkins };
}

/**
 * Get estimated turnout for multiple events (batch, for the events list page).
 */
export async function getBatchEstimatedTurnout(
	eventIds: string[]
): Promise<Map<string, number>> {
	if (eventIds.length === 0) return new Map();

	// Get all RSVPs for these events
	const rsvps = await db
		.select({
			eventId: eventRsvps.eventId,
			memberId: eventRsvps.memberId,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.where(
			and(
				inArray(eventRsvps.eventId, eventIds),
				sql`${eventRsvps.status} IN ('going', 'maybe')`
			)
		);

	if (rsvps.length === 0) return new Map();

	const allMemberIds = [...new Set(rsvps.map((r) => r.memberId))];
	const scores = await getMemberReliabilityScores(allMemberIds);

	const DEFAULT_RELIABILITY = 0.5;
	const MAYBE_WEIGHT = 0.3;
	const turnoutMap = new Map<string, number>();

	for (const rsvp of rsvps) {
		const reliability = scores.get(rsvp.memberId) ?? DEFAULT_RELIABILITY;
		const contribution =
			rsvp.status === 'going' ? reliability : reliability * MAYBE_WEIGHT;
		turnoutMap.set(rsvp.eventId, (turnoutMap.get(rsvp.eventId) ?? 0) + contribution);
	}

	// Round values
	for (const [key, val] of turnoutMap) {
		turnoutMap.set(key, Math.round(val * 10) / 10);
	}

	return turnoutMap;
}

// --- Member Interest Analytics ---

export interface InterestCount {
	preference: string;
	total: number;
	astronomyCount: number;
	physicsCount: number;
}

export interface InterestBreakdownResult {
	interests: InterestCount[];
	activeMemberCount: number;
}

export async function getInterestBreakdown(): Promise<InterestBreakdownResult> {
	const [interestRows, countRows] = await Promise.all([
		db.execute(sql`
			SELECT
				pref AS preference,
				count(*)::int AS total,
				count(*) FILTER (WHERE m.astronomy_member = true)::int AS astronomy_count,
				count(*) FILTER (WHERE m.physics_member = true)::int AS physics_count
			FROM members m,
				jsonb_array_elements_text(m.event_preferences) AS pref
			WHERE m.email_verified = true
				AND m.updated_at >= NOW() - INTERVAL '6 months'
			GROUP BY pref
			ORDER BY total DESC
		`),
		db.execute(sql`
			SELECT count(DISTINCT m.id)::int AS active_count
			FROM members m
			WHERE m.email_verified = true
				AND m.updated_at >= NOW() - INTERVAL '6 months'
				AND m.event_preferences IS NOT NULL
				AND jsonb_array_length(m.event_preferences) > 0
		`)
	]);

	interface InterestRow { preference: string; total: number; astronomy_count: number; physics_count: number }
	interface CountRow { active_count: number }

	return {
		interests: (interestRows.rows as unknown as InterestRow[]).map((r) => ({
			preference: r.preference,
			total: r.total,
			astronomyCount: r.astronomy_count,
			physicsCount: r.physics_count
		})),
		activeMemberCount: (countRows.rows[0] as unknown as CountRow | undefined)?.active_count ?? 0
	};
}

export interface MembershipStats {
	totalMembers: number;
	astronomyMembers: number;
	physicsMembers: number;
	membersWithPreferences: number;
}

export async function getMembershipStats(): Promise<MembershipStats> {
	const rows = await db
		.select({
			totalMembers: sql<number>`count(*)::int`,
			astronomyMembers: sql<number>`count(*) FILTER (WHERE ${members.astronomyMember} = true)::int`,
			physicsMembers: sql<number>`count(*) FILTER (WHERE ${members.physicsMember} = true)::int`,
			membersWithPreferences: sql<number>`count(*) FILTER (WHERE ${members.eventPreferences} IS NOT NULL AND jsonb_array_length(${members.eventPreferences}) > 0)::int`
		})
		.from(members);

	const r = rows[0];
	return {
		totalMembers: r.totalMembers,
		astronomyMembers: r.astronomyMembers,
		physicsMembers: r.physicsMembers,
		membersWithPreferences: r.membersWithPreferences
	};
}

// --- Event Announcement Queries ---

export async function getAnnouncementRecipients(
	eventId: string,
	clubType: ClubType
): Promise<{ id: string; email: string; firstName: string; unsubscribeToken: string }[]> {
	const clubColumn = clubType === 'astronomy' ? members.astronomyMember : members.physicsMember;

	return db
		.select({
			id: members.id,
			email: members.email,
			firstName: members.firstName,
			unsubscribeToken: members.unsubscribeToken
		})
		.from(members)
		.where(
			and(
				eq(clubColumn, true),
				eq(members.emailVerified, true),
				eq(members.emailOptOut, false),
				sql`NOT EXISTS (
					SELECT 1 FROM event_announcement_logs eal
					WHERE eal.event_id = ${eventId}
						AND eal.member_id = ${members.id}
				)`
			)
		);
}

export async function getAnnouncementRecipientCount(
	eventId: string,
	clubType: ClubType
): Promise<number> {
	const clubColumn = clubType === 'astronomy' ? members.astronomyMember : members.physicsMember;

	const result = await db
		.select({ count: sql<number>`count(*)::int` })
		.from(members)
		.where(
			and(
				eq(clubColumn, true),
				eq(members.emailVerified, true),
				eq(members.emailOptOut, false),
				sql`NOT EXISTS (
					SELECT 1 FROM event_announcement_logs eal
					WHERE eal.event_id = ${eventId}
						AND eal.member_id = ${members.id}
				)`
			)
		);

	return result[0]?.count ?? 0;
}

export async function getExcludedAnnouncementBreakdown(
	eventId: string,
	clubType: ClubType
): Promise<{ unverified: number; optedOut: number }> {
	const clubColumn = clubType === 'astronomy' ? members.astronomyMember : members.physicsMember;

	const result = await db
		.select({
			unverified: sql<number>`count(*) filter (where ${members.emailVerified} = false)::int`,
			optedOut: sql<number>`count(*) filter (where ${members.emailVerified} = true and ${members.emailOptOut} = true)::int`
		})
		.from(members)
		.where(eq(clubColumn, true));

	return result[0] ?? { unverified: 0, optedOut: 0 };
}

export async function getEmailedMembers(
	eventId: string
): Promise<{ id: string; firstName: string; lastName: string; email: string; sentAt: Date }[]> {
	return db
		.select({
			id: members.id,
			firstName: members.firstName,
			lastName: members.lastName,
			email: members.email,
			sentAt: eventAnnouncementLogs.sentAt
		})
		.from(eventAnnouncementLogs)
		.innerJoin(members, eq(eventAnnouncementLogs.memberId, members.id))
		.where(eq(eventAnnouncementLogs.eventId, eventId))
		.orderBy(eventAnnouncementLogs.sentAt);
}

export async function getCorrectionRecipients(
	eventId: string
): Promise<{ id: string; email: string; firstName: string; unsubscribeToken: string }[]> {
	return db
		.select({
			id: members.id,
			email: members.email,
			firstName: members.firstName,
			unsubscribeToken: members.unsubscribeToken
		})
		.from(eventAnnouncementLogs)
		.innerJoin(members, eq(eventAnnouncementLogs.memberId, members.id))
		.where(
			and(
				eq(eventAnnouncementLogs.eventId, eventId),
				eq(members.emailOptOut, false)
			)
		);
}
