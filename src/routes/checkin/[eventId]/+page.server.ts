import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventCheckins, members } from '$lib/server/db/schema';
import type { CheckinQuestion } from '$lib/server/db/schema';
import { checkHoneypot, checkRateLimit, checkSubmissionTiming } from '$lib/server/security';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
	if (!locals.member) {
		const redirectPath = `/checkin/${params.eventId}?code=${url.searchParams.get('code') || ''}`;
		throw redirect(303, `/register?redirectTo=${encodeURIComponent(redirectPath)}`);
	}

	const code = url.searchParams.get('code');
	if (!code) {
		error(400, 'Missing check-in code.');
	}

	// Find the event by ID and verify checkin code
	const eventResult = await db
		.select({
			id: events.id,
			title: events.title,
			date: events.date,
			clubType: events.clubType,
			checkinCode: events.checkinCode,
			checkinQuestions: events.checkinQuestions
		})
		.from(events)
		.where(and(eq(events.id, params.eventId), eq(events.isPublished, true)))
		.limit(1);

	if (eventResult.length === 0) {
		error(404, 'Event not found.');
	}

	const event = eventResult[0];

	if (event.checkinCode !== code) {
		error(400, 'Invalid check-in code.');
	}

	// Check if already checked in
	const existing = await db
		.select({ id: eventCheckins.id })
		.from(eventCheckins)
		.where(
			and(
				eq(eventCheckins.eventId, event.id),
				eq(eventCheckins.memberId, locals.member.id)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		return {
			event: { id: event.id, title: event.title, date: event.date, clubType: event.clubType },
			alreadyCheckedIn: true,
			success: false,
			joinedClub: false,
			hasQuestions: false,
			questions: [] as CheckinQuestion[],
			code
		};
	}

	const hasQuestions = event.checkinQuestions && event.checkinQuestions.length > 0;

	if (!hasQuestions) {
		// No questions — auto check-in (existing behavior)
		let joinedClub = false;
		const isMember =
			event.clubType === 'astronomy' ? locals.member.astronomyMember : locals.member.physicsMember;

		if (!isMember) {
			const clubField =
				event.clubType === 'astronomy' ? { astronomyMember: true } : { physicsMember: true };
			await db.update(members).set(clubField).where(eq(members.id, locals.member.id));
			joinedClub = true;
		}

		const inserted = await db.insert(eventCheckins).values({
			eventId: event.id,
			memberId: locals.member.id
		}).onConflictDoNothing().returning({ id: eventCheckins.id });

		return {
			event: { id: event.id, title: event.title, date: event.date, clubType: event.clubType },
			alreadyCheckedIn: inserted.length === 0,
			success: inserted.length > 0,
			joinedClub: inserted.length > 0 && joinedClub,
			hasQuestions: false,
			questions: [] as CheckinQuestion[],
			code
		};
	}

	// Has questions — return event data with questions, let client show form
	return {
		event: { id: event.id, title: event.title, date: event.date, clubType: event.clubType },
		alreadyCheckedIn: false,
		success: false,
		joinedClub: false,
		hasQuestions: true,
		questions: event.checkinQuestions!,
		code
	};
};

export const actions: Actions = {
	checkin: async (requestEvent) => {
		const rateLimited = checkRateLimit(requestEvent, 'checkin');
		if (rateLimited) return rateLimited;

		const { request, params, locals } = requestEvent;

		if (!locals.member) {
			return fail(401, { error: 'Not authenticated.' });
		}

		const formData = await request.formData();

		const honeypotFail = checkHoneypot(formData);
		if (honeypotFail) return honeypotFail;

		const timingFail = checkSubmissionTiming(formData);
		if (timingFail) return timingFail;
		const code = formData.get('code') as string;

		// Re-validate event and code
		const eventResult = await db
			.select({
				id: events.id,
				title: events.title,
				date: events.date,
				clubType: events.clubType,
				checkinCode: events.checkinCode,
				checkinQuestions: events.checkinQuestions
			})
			.from(events)
			.where(and(eq(events.id, params.eventId), eq(events.isPublished, true)))
			.limit(1);

		if (eventResult.length === 0) {
			return fail(404, { error: 'Event not found.' });
		}

		const event = eventResult[0];

		if (event.checkinCode !== code) {
			return fail(400, { error: 'Invalid check-in code.' });
		}

		// Auto-join club if not already a member
		let joinedClub = false;
		const isMember =
			event.clubType === 'astronomy' ? locals.member.astronomyMember : locals.member.physicsMember;

		if (!isMember) {
			const clubField =
				event.clubType === 'astronomy' ? { astronomyMember: true } : { physicsMember: true };
			await db.update(members).set(clubField).where(eq(members.id, locals.member.id));
			joinedClub = true;
		}

		// Parse question responses from form data
		const questions = event.checkinQuestions || [];
		const responses: Record<string, string | string[]> = {};

		for (const q of questions) {
			if (q.type === 'checkbox') {
				const vals = formData.getAll(`q_${q.id}`) as string[];
				if (vals.length > 0) responses[q.id] = vals;
			} else {
				const val = (formData.get(`q_${q.id}`) as string)?.trim();
				if (val) responses[q.id] = val;
			}

			// Validate required questions
			if (q.required) {
				const val = responses[q.id];
				if (!val || (Array.isArray(val) && val.length === 0)) {
					return fail(400, { error: `Please answer: ${q.question}` });
				}
			}
		}

		// Atomic insert with conflict handling to prevent race conditions
		const inserted = await db.insert(eventCheckins).values({
			eventId: event.id,
			memberId: locals.member.id,
			questionResponses: Object.keys(responses).length > 0 ? responses : null
		}).onConflictDoNothing().returning({ id: eventCheckins.id });

		if (inserted.length === 0) {
			return fail(400, { error: 'Already checked in.' });
		}

		return { success: true, joinedClub };
	}
};
