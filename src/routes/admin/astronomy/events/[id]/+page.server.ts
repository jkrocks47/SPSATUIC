import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events, eventAnnouncementLogs } from '$lib/server/db/schema';
import {
	getEventDetailForAdmin,
	getAnnouncementRecipients,
	getAnnouncementRecipientCount
} from '$lib/server/db/queries';
import { sendEventAnnouncementEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await getEventDetailForAdmin(params.id, 'astronomy');

	if (!result) {
		error(404, 'Event not found.');
	}

	const announcementRecipientCount = await getAnnouncementRecipientCount(params.id, 'astronomy');

	return {
		event: result.event,
		rsvpList: result.rsvpList,
		stats: result.stats,
		historicalRate: result.historicalRate,
		announcementRecipientCount,
		announcementAlreadySent: !!result.event.announcementSentAt
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

		const baseUrl = env.PUBLIC_BASE_URL || 'http://localhost:5173';
		const eventUrl = `${baseUrl}/astronomy/events/${params.id}`;
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
	}
};
