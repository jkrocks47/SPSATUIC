import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventAnnouncementLogs } from '$lib/server/db/schema';
import {
	getEventDetailForAdmin,
	getAnnouncementRecipients,
	getAnnouncementRecipientCount,
	getCorrectionRecipients,
	getEmailedMembers
} from '$lib/server/db/queries';
import { sendEventAnnouncementEmail, sendEventCorrectionEmail, getBaseUrl } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getEventDetailForAdmin(params.id, 'astronomy');

	if (!result) {
		error(404, 'Event not found.');
	}

	const [announcementRecipientCount, emailedMembers] = await Promise.all([
		getAnnouncementRecipientCount(params.id, 'astronomy'),
		getEmailedMembers(params.id)
	]);

	return {
		event: result.event,
		rsvpList: result.rsvpList,
		stats: result.stats,
		historicalRate: result.historicalRate,
		announcementRecipientCount,
		announcementAlreadySent: !!result.event.announcementSentAt,
		emailedMembers,
		checkinQuestions: result.event.checkinQuestions ?? [],
		checkinResponses: result.checkinResponses
	};
};

export const actions: Actions = {
	sendAnnouncement: async ({ params }) => {
		const eventResult = await db
			.select()
			.from(events)
			.where(eq(events.id, params.id))
			.limit(1);

		if (eventResult.length === 0) return fail(404, { error: 'Event not found.' });

		const event = eventResult[0];

		const recipients = await getAnnouncementRecipients(params.id, 'astronomy');

		if (recipients.length === 0) return fail(400, { error: 'No eligible recipients.' });

		const baseUrl = getBaseUrl();
		const eventUrl = `${baseUrl}/event/${params.id}`;
		let sentCount = 0;

		for (const recipient of recipients) {
			try {
				await sendEventAnnouncementEmail(
					recipient.email,
					recipient.firstName,
					{
						title: event.title,
						date: event.date,
						time: event.time,
						location: event.location,
						clubType: 'astronomy'
					},
					eventUrl,
					recipient.unsubscribeToken
				);

				await db
					.insert(eventAnnouncementLogs)
					.values({
						eventId: params.id,
						memberId: recipient.id
					})
					.onConflictDoNothing();

				sentCount++;
			} catch (err) {
				console.error(`[Announcement] Failed to send to ${recipient.email}:`, err);
			}
		}

		await db
			.update(events)
			.set({ announcementSentAt: new Date() })
			.where(eq(events.id, params.id));

		return { success: true, sentCount };
	},

	sendCorrection: async ({ params }) => {
		const eventResult = await db
			.select()
			.from(events)
			.where(eq(events.id, params.id))
			.limit(1);

		if (eventResult.length === 0) return fail(404, { error: 'Event not found.' });

		const event = eventResult[0];

		if (!event.announcementSentAt) {
			return fail(400, { error: 'No announcement has been sent yet.' });
		}

		const recipients = await getCorrectionRecipients(params.id);

		if (recipients.length === 0) return fail(400, { error: 'No recipients to send correction to.' });

		const baseUrl = getBaseUrl();
		const eventUrl = `${baseUrl}/event/${params.id}`;
		let sentCount = 0;

		for (const recipient of recipients) {
			try {
				await sendEventCorrectionEmail(
					recipient.email,
					recipient.firstName,
					{
						title: event.title,
						date: event.date,
						time: event.time,
						location: event.location,
						clubType: 'astronomy'
					},
					eventUrl,
					recipient.unsubscribeToken
				);
				sentCount++;
			} catch (err) {
				console.error(`[Correction] Failed to send to ${recipient.email}:`, err);
			}
		}

		return { success: true, sentCount, isCorrection: true };
	}
};
