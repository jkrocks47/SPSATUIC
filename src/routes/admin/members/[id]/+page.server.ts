import { error, fail } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, eventCheckins, eventRsvps, events } from '$lib/server/db/schema';
import { ROLES } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const result = await db.select().from(members).where(eq(members.id, params.id)).limit(1);

	if (result.length === 0) {
		error(404, 'Member not found');
	}

	const member = result[0];

	// Events attended
	const attended = await db
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
		.orderBy(desc(eventCheckins.checkedInAt));

	// RSVPs
	const rsvps = await db
		.select({
			eventId: events.id,
			title: events.title,
			date: events.date,
			clubType: events.clubType,
			status: eventRsvps.status
		})
		.from(eventRsvps)
		.innerJoin(events, eq(eventRsvps.eventId, events.id))
		.where(eq(eventRsvps.memberId, member.id))
		.orderBy(desc(events.date));

	return { member, attended, rsvps, currentUserRole: locals.member?.adminRole ?? null };
};

export const actions: Actions = {
	updateAdminRole: async ({ request, params, locals }) => {
		if (locals.member?.adminRole !== 'super_admin') {
			return fail(403, { error: 'Only super admins can manage admin roles.' });
		}

		const formData = await request.formData();
		const adminRole = formData.get('adminRole') as string;

		if (adminRole && !ROLES.includes(adminRole as any)) {
			return fail(400, { error: 'Invalid admin role.' });
		}

		// Prevent removing your own super_admin role
		if (params.id === locals.member.id && adminRole !== 'super_admin') {
			return fail(400, { error: 'You cannot remove your own super admin role.' });
		}

		await db
			.update(members)
			.set({ adminRole: adminRole || null, updatedAt: new Date() })
			.where(eq(members.id, params.id));

		return { success: true };
	},

	updateRole: async ({ request, params }) => {
		const formData = await request.formData();
		const role = formData.get('role') as 'member' | 'board';

		if (!['member', 'board'].includes(role)) {
			return fail(400, { error: 'Invalid role.' });
		}

		await db
			.update(members)
			.set({ role, updatedAt: new Date() })
			.where(eq(members.id, params.id));

		return { success: true };
	}
};
