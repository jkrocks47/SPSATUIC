import { Resend } from 'resend';
import { SITE_NAME } from '$lib/utils/constants';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function escapeHtml(str: string | null | undefined): string {
	if (!str) return '';
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function getResend() {
	return new Resend(env.RESEND_API_KEY);
}

const FROM_EMAIL = 'UICSpacetime <noreply@uicspacetime.org>';

export function getBaseUrl() {
	return publicEnv.PUBLIC_BASE_URL || 'https://uicspacetime.org';
}

function buildUnsubscribeFooter(unsubscribeToken: string): string {
	const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
	return `
    <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.06);">
      <p style="font-size: 0.75rem; color: #6b7280; margin: 0;">
        Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #818cf8; text-decoration: none;">Unsubscribe</a>
      </p>
    </div>`;
}

function getUnsubscribeHeaders(unsubscribeToken: string) {
	const unsubscribeUrl = `${getBaseUrl()}/unsubscribe?token=${unsubscribeToken}`;
	return {
		'List-Unsubscribe': `<${unsubscribeUrl}>`,
		'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
	};
}

export async function sendVerificationEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const verifyUrl = `${getBaseUrl()}/verify-email?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Verify your ${SITE_NAME} account`,
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Email Verification</p>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Welcome to ${SITE_NAME}! Please verify your email address to get started.</p>
    <a href="${verifyUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Verify Email</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
  </div>
</body>
</html>`
	});
}

export async function sendContactEmail(senderName: string, senderEmail: string, message: string, recipientEmails: string[]) {
	const resend = getResend();

	await resend.emails.send({
		from: FROM_EMAIL,
		to: recipientEmails,
		replyTo: senderEmail,
		subject: `[${SITE_NAME}] New message from ${senderName}`,
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Contact Form Submission</p>
    <p><strong style="color: #fff;">From:</strong> ${escapeHtml(senderName)} (${escapeHtml(senderEmail)})</p>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4f46e5;">
      <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
    </div>
    <p style="font-size: 0.85rem; color: #9ca3af;">Reply directly to this email to respond to ${escapeHtml(senderName)}.</p>
  </div>
</body>
</html>`
	});
}

export async function sendPreferenceReviewEmail(email: string, name: string, unsubscribeToken?: string) {
	const resend = getResend();
	const profileUrl = `${getBaseUrl()}/dashboard/profile`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] Help us plan better events — update your interests`,
		...(unsubscribeToken ? { headers: getUnsubscribeHeaders(unsubscribeToken) } : {}),
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">New Semester Check-in</p>
    <p>Hi ${escapeHtml(name)},</p>
    <p>A new semester is here! We use your event interests to plan activities that match what members actually want. Take a moment to review yours so we can make this semester great.</p>
    <a href="${profileUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Update My Interests</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">This takes less than a minute. Your selections help us decide what events to host.</p>
    ${unsubscribeToken ? buildUnsubscribeFooter(unsubscribeToken) : ''}
  </div>
</body>
</html>`
	});
}

export async function sendPasswordResetEmail(email: string, token: string, name: string) {
	const resend = getResend();
	const resetUrl = `${getBaseUrl()}/reset-password?token=${token}`;

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `Reset your ${SITE_NAME} password`,
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Password Reset</p>
    <p>Hi ${escapeHtml(name)},</p>
    <p>We received a request to reset your password. Click the button below to set a new password.</p>
    <a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">Reset Password</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
  </div>
</body>
</html>`
	});
}

export async function sendEventCorrectionEmail(
	email: string,
	firstName: string,
	event: {
		title: string;
		date: string;
		time: string | null;
		location: string | null;
		clubType: string;
	},
	eventUrl: string,
	unsubscribeToken: string
) {
	const resend = getResend();
	const clubLabel = event.clubType === 'astronomy' ? 'Astronomy Club' : 'Physics Club';
	const dateFormatted = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] Correction: ${event.title} — ${clubLabel}`,
		headers: getUnsubscribeHeaders(unsubscribeToken),
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Event Correction &middot; ${clubLabel}</p>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We sent you incorrect details for an upcoming event. Here are the <strong style="color: #fff;">corrected</strong> details:</p>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #f59e0b;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #fff;">${escapeHtml(event.title)}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${event.time ? ` at ${escapeHtml(event.time)}` : ''}</p>
      ${event.location ? `<p style="margin: 0; font-size: 0.9rem;">${escapeHtml(event.location)}</p>` : ''}
    </div>
    <p style="font-size: 0.85rem; color: #fbbf24;">Please disregard the previous email with incorrect information.</p>
    <a href="${eventUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">View Event &amp; RSVP</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">We apologize for the confusion. You're receiving this because you're a member of the ${clubLabel} on ${SITE_NAME}.</p>
    ${buildUnsubscribeFooter(unsubscribeToken)}
  </div>
</body>
</html>`
	});
}

export async function sendEventAnnouncementEmail(
	email: string,
	firstName: string,
	event: {
		title: string;
		date: string;
		time: string | null;
		location: string | null;
		clubType: string;
		rsvpRequired?: boolean;
	},
	eventUrl: string,
	unsubscribeToken: string
) {
	const resend = getResend();
	const clubLabel = event.clubType === 'astronomy' ? 'Astronomy Club' : 'Physics Club';
	const dateFormatted = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] ${event.title} — ${clubLabel}`,
		headers: getUnsubscribeHeaders(unsubscribeToken),
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">Event Announcement &middot; ${clubLabel}</p>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>We have an upcoming event we think you'll enjoy!</p>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4f46e5;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #fff;">${escapeHtml(event.title)}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${event.time ? ` at ${escapeHtml(event.time)}` : ''}</p>
      ${event.location ? `<p style="margin: 0; font-size: 0.9rem;">${escapeHtml(event.location)}</p>` : ''}
    </div>
    ${event.rsvpRequired ? `<div style="margin: 0.75rem 0; padding: 0.5rem 0.75rem; background: rgba(239,68,68,0.15); border-left: 3px solid #ef4444; border-radius: 4px;"><strong style="color: #f87171;">RSVP is required to attend this event.</strong></div>` : ''}
    <a href="${eventUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">View Event &amp; RSVP</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">You're receiving this because you're a member of the ${clubLabel} on ${SITE_NAME}.</p>
    ${buildUnsubscribeFooter(unsubscribeToken)}
  </div>
</body>
</html>`
	});
}

export async function sendRsvpRequiredReminderEmail(
	email: string,
	firstName: string,
	event: {
		title: string;
		date: string;
		time: string | null;
		location: string | null;
		clubType: string;
	},
	eventUrl: string,
	unsubscribeToken: string
) {
	const resend = getResend();
	const clubLabel = event.clubType === 'astronomy' ? 'Astronomy Club' : 'Physics Club';
	const dateFormatted = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	await resend.emails.send({
		from: FROM_EMAIL,
		to: email,
		subject: `[${SITE_NAME}] RSVP Required: ${event.title} — ${clubLabel}`,
		headers: getUnsubscribeHeaders(unsubscribeToken),
		html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0f; color: #e5e7eb; padding: 2rem;">
  <div style="max-width: 480px; margin: 0 auto; background: #191923; border-radius: 12px; padding: 2rem; border: 1px solid rgba(79,70,229,0.3);">
    <h1 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">${SITE_NAME}</h1>
    <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">RSVP Required &middot; ${clubLabel}</p>
    <p>Hi ${escapeHtml(firstName)},</p>
    <p>A friendly reminder that <strong>RSVP is required</strong> to attend the following event:</p>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4f46e5;">
      <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #fff;">${escapeHtml(event.title)}</p>
      <p style="margin: 0 0 0.25rem 0; font-size: 0.9rem;">${dateFormatted}${event.time ? ` at ${escapeHtml(event.time)}` : ''}</p>
      ${event.location ? `<p style="margin: 0; font-size: 0.9rem;">${escapeHtml(event.location)}</p>` : ''}
    </div>
    <div style="margin: 0.75rem 0; padding: 0.5rem 0.75rem; background: rgba(239,68,68,0.15); border-left: 3px solid #ef4444; border-radius: 4px;">
      <strong style="color: #f87171;">You must RSVP to attend. Spots may be limited.</strong>
    </div>
    <a href="${eventUrl}" style="display: inline-block; background: #4f46e5; color: #fff; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 1rem 0;">RSVP Now</a>
    <p style="font-size: 0.85rem; color: #9ca3af;">You're receiving this because you're a member of the ${clubLabel} on ${SITE_NAME}.</p>
    ${buildUnsubscribeFooter(unsubscribeToken)}
  </div>
</body>
</html>`
	});
}

const ADMIN_ALERT_EMAIL = 'mgiblin@blthermals.com';

export async function sendAdminAlertEmail(subject: string, details: string) {
	const resend = getResend();
	await resend.emails.send({
		from: FROM_EMAIL,
		to: ADMIN_ALERT_EMAIL,
		subject: `[${SITE_NAME} Alert] ${subject}`,
		html: `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 24px; background: #0f172a; font-family: monospace; color: #e2e8f0;">
  <div style="max-width: 560px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid rgba(248,113,113,0.3);">
    <h2 style="margin: 0 0 16px; color: #f87171; font-size: 1.1rem;">&#9888; ${escapeHtml(subject)}</h2>
    <pre style="background: rgba(0,0,0,0.4); padding: 16px; border-radius: 8px; white-space: pre-wrap; word-break: break-all; color: #e2e8f0; font-size: 0.85rem; margin: 0 0 16px;">${escapeHtml(details)}</pre>
    <p style="margin: 0; font-size: 0.75rem; color: #6b7280;">Timestamp: ${new Date().toISOString()}</p>
  </div>
</body>
</html>`
	});
}
