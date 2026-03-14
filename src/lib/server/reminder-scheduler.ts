import { eq, and, sql } from 'drizzle-orm';
import { db } from './db';
import { events, eventRsvps, members, reminderLogs } from './db/schema';
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { SITE_NAME } from '$lib/utils/constants';
import { sendPreferenceReviewEmail } from './email';

const FROM_EMAIL = 'UICSpacetime <noreply@uicspacetime.org>';
const POLL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

let intervalId: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;

export function startReminderScheduler(): void {
	if (intervalId !== null) return;

	console.log('[Reminders] Scheduler started, polling every 15 minutes');

	// Run once on startup, then on interval
	processReminders().catch((err) => console.error('[Reminders] Error:', err));

	intervalId = setInterval(() => {
		processReminders().catch((err) => console.error('[Reminders] Error:', err));
	}, POLL_INTERVAL_MS);
}

export function stopReminderScheduler(): void {
	if (intervalId !== null) {
		clearInterval(intervalId);
		intervalId = null;
	}
}

function getChicagoDateString(daysFromNow: number): string {
	const date = new Date();
	date.setDate(date.getDate() + daysFromNow);
	// Use Chicago timezone since UIC is in Chicago
	const parts = date
		.toLocaleDateString('en-CA', { timeZone: 'America/Chicago' })
		.split('-');
	return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
}

async function processReminders(): Promise<void> {
	if (isProcessing) return;
	isProcessing = true;

	try {
		const in7Days = getChicagoDateString(7);
		const in1Day = getChicagoDateString(1);

		await sendRemindersForDate(in7Days, '7_day');
		await sendRemindersForDate(in1Day, '1_day');
		await sendPreferenceReviewReminders();
	} finally {
		isProcessing = false;
	}
}

interface PendingReminder {
	eventId: string;
	eventTitle: string;
	eventDate: string;
	eventTime: string | null;
	eventLocation: string | null;
	eventClubType: string;
	memberId: string;
	memberEmail: string;
	memberFirstName: string;
	rsvpStatus: string;
}

async function sendRemindersForDate(
	targetDate: string,
	reminderType: '7_day' | '1_day'
): Promise<void> {
	const pendingReminders: PendingReminder[] = await db
		.select({
			eventId: events.id,
			eventTitle: events.title,
			eventDate: events.date,
			eventTime: events.time,
			eventLocation: events.location,
			eventClubType: events.clubType,
			memberId: members.id,
			memberEmail: members.email,
			memberFirstName: members.firstName,
			rsvpStatus: eventRsvps.status
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.innerJoin(members, eq(eventRsvps.memberId, members.id))
		.where(
			and(
				eq(events.date, targetDate),
				eq(events.isPublished, true),
				eq(members.emailVerified, true),
				sql`${eventRsvps.status} IN ('going', 'maybe')`,
				sql`NOT EXISTS (
					SELECT 1 FROM reminder_logs rl
					WHERE rl.event_id = ${eventRsvps.eventId}
						AND rl.member_id = ${eventRsvps.memberId}
						AND rl.reminder_type = ${reminderType}
				)`
			)
		);

	if (pendingReminders.length === 0) return;

	console.log(
		`[Reminders] Sending ${pendingReminders.length} ${reminderType} reminder(s)`
	);

	const resend = new Resend(env.RESEND_API_KEY);

	for (const reminder of pendingReminders) {
		try {
			const html = buildReminderEmail(reminder, reminderType);
			const timeframe = reminderType === '7_day' ? 'is in one week' : 'is tomorrow';
			const subject =
				reminderType === '7_day'
					? `Reminder: ${reminder.eventTitle} is in one week`
					: `Tomorrow: ${reminder.eventTitle}`;

			await resend.emails.send({
				from: FROM_EMAIL,
				to: reminder.memberEmail,
				subject: `[${SITE_NAME}] ${subject}`,
				html
			});

			await db
				.insert(reminderLogs)
				.values({
					eventId: reminder.eventId,
					memberId: reminder.memberId,
					reminderType,
					rsvpStatus: reminder.rsvpStatus as 'going' | 'maybe' | 'not_going'
				})
				.onConflictDoNothing();

			console.log(
				`[Reminders] Sent ${reminderType} to ${reminder.memberEmail} for "${reminder.eventTitle}"`
			);
		} catch (err) {
			console.error(
				`[Reminders] Failed to send to ${reminder.memberEmail}:`,
				err
			);
		}
	}
}

async function sendPreferenceReviewReminders(): Promise<void> {
	// Find verified members whose preferences are stale (>4 months) and
	// who haven't been sent a reminder email in the last 4 months
	const staleMembers = await db
		.select({
			id: members.id,
			email: members.email,
			firstName: members.firstName
		})
		.from(members)
		.where(
			and(
				eq(members.emailVerified, true),
				sql`(${members.preferencesReviewedAt} IS NULL OR ${members.preferencesReviewedAt} < NOW() - INTERVAL '4 months')`,
				sql`(${members.preferenceReminderSentAt} IS NULL OR ${members.preferenceReminderSentAt} < NOW() - INTERVAL '4 months')`
			)
		);

	if (staleMembers.length === 0) return;

	console.log(
		`[Reminders] Sending preference review emails to ${staleMembers.length} member(s)`
	);

	for (const member of staleMembers) {
		try {
			await sendPreferenceReviewEmail(member.email, member.firstName);

			await db
				.update(members)
				.set({ preferenceReminderSentAt: new Date() })
				.where(eq(members.id, member.id));

			console.log(
				`[Reminders] Sent preference review to ${member.email}`
			);
		} catch (err) {
			console.error(
				`[Reminders] Failed to send preference review to ${member.email}:`,
				err
			);
		}
	}
}

function buildReminderEmail(
	data: PendingReminder,
	reminderType: '7_day' | '1_day'
): string {
	const baseUrl = env.PUBLIC_BASE_URL || 'http://localhost:5173';
	const timeframe = reminderType === '7_day' ? 'in one week' : 'tomorrow';
	const clubLabel =
		data.eventClubType === 'astronomy' ? 'Astronomy Club' : 'Physics Club';

	const dateFormatted = new Date(data.eventDate + 'T00:00:00').toLocaleDateString(
		'en-US',
		{
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	);

	const isMaybe = data.rsvpStatus === 'maybe';

	const mainMessage = isMaybe
		? `You marked "maybe" for <strong style="color: #fff;">${data.eventTitle}</strong>, which is happening ${timeframe}. We'd love to see you there! If you can make it, update your RSVP to confirm your spot.`
		: `Just a friendly reminder that <strong style="color: #fff;">${data.eventTitle}</strong> is ${timeframe}. We're looking forward to seeing you there!`;

	const ctaText = isMaybe ? 'Confirm Your RSVP' : 'View Event Details';

	return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Event Reminder &middot; ${clubLabel}</p>
    <p>Hi ${data.memberFirstName},</p>
    <p>${mainMessage}</p>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4f46e5;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #fff;">${data.eventTitle}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${data.eventTime ? ` at ${data.eventTime}` : ''}</p>
      ${data.eventLocation ? `<p style="margin: 0; font-size: 0.9rem;">${data.eventLocation}</p>` : ''}
    </div>
    <a href="${baseUrl}/dashboard/events" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">${ctaText}</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">You're receiving this because you RSVP'd to this event on ${SITE_NAME}.</p>
  </div>
</body>
</html>`;
}
