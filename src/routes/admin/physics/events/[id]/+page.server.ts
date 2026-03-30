import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventAnnouncementLogs } from '$lib/server/db/schema';
import {
	getEventDetailForAdmin,
	getAnnouncementRecipients,
	getAnnouncementRecipientCount
} from '$lib/server/db/queries';
import { sendEventAnnouncementEmail, getBaseUrl } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getEventDetailForAdmin(params.id, 'physics');

	if (!result) {
		error(404, 'Event not found.');
	}

	const announcementRecipientCount = await getAnnouncementRecipientCount(params.id, 'physics');

	return {
		event: result.event,
		rsvpList: result.rsvpList,
		stats: result.stats,
		historicalRate: result.historicalRate,
		announcementRecipientCount,
		announcementAlreadySent: !!result.event.announcementSentAt,
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
		const recipients = await getAnnouncementRecipients(params.id, 'physics');

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
						clubType: 'physics'
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
	}
};
