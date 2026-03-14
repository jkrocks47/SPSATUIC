import { fail } from '@sveltejs/kit';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { members, eventCheckins } from '$lib/server/db/schema';
import { ROLES } from '$lib/utils/constants';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const search = url.searchParams.get('search') || '';
	const clubFilter = url.searchParams.get('club') || '';
	const roleFilter = url.searchParams.get('role') || '';
	const interestFilter = url.searchParams.get('interest') || '';

	let query = db.select().from(members).orderBy(desc(members.createdAt)).$dynamic();

	if (search) {
		query = query.where(
			or(
				ilike(members.email, `%${search}%`),
				ilike(members.firstName, `%${search}%`),
				ilike(members.lastName, `%${search}%`)
			)
		);
	}

	const allMembers = await query;

	// Filter in JS for club and role (simpler than dynamic query building)
	let filtered = allMembers;
	if (clubFilter === 'astronomy') filtered = filtered.filter((m) => m.astronomyMember);
	if (clubFilter === 'physics') filtered = filtered.filter((m) => m.physicsMember);
	if (roleFilter) filtered = filtered.filter((m) => m.role === roleFilter);
	if (interestFilter) {
		filtered = filtered.filter(
			(m) => Array.isArray(m.eventPreferences) && m.eventPreferences.includes(interestFilter)
		);
	}

	// Get attendance counts
	const checkinCounts = await db
		.select({
			memberId: eventCheckins.memberId,
			count: sql<number>`count(*)`
		})
		.from(eventCheckins)
		.groupBy(eventCheckins.memberId);

	const checkinMap: Record<string, number> = {};
	for (const row of checkinCounts) {
		checkinMap[row.memberId] = Number(row.count);
	}

	const membersWithStats = filtered.map((m) => ({
		...m,
		eventsAttended: checkinMap[m.id] || 0
	}));

	return {
		members: membersWithStats,
		search,
		clubFilter,
		roleFilter,
		interestFilter,
		totalCount: allMembers.length,
		currentUserRole: locals.member?.adminRole ?? null
	};
};

export const actions: Actions = {
	updateRole: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const role = formData.get('role') as 'member' | 'board';

		if (!id || !['member', 'board'].includes(role)) {
			return fail(400, { error: 'Invalid input.' });
		}

		await db.update(members).set({ role, updatedAt: new Date() }).where(eq(members.id, id));

		return { success: true };
	},

	updateAdminRole: async ({ request, locals }) => {
		if (locals.member?.adminRole !== 'super_admin') {
			return fail(403, { error: 'Only super admins can manage admin roles.' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const adminRole = formData.get('adminRole') as string;

		if (!id) {
			return fail(400, { error: 'Invalid input.' });
		}

		if (adminRole && !ROLES.includes(adminRole as any)) {
			return fail(400, { error: 'Invalid admin role.' });
		}

		// Prevent removing your own super_admin role
		if (id === locals.member.id && adminRole !== 'super_admin') {
			return fail(400, { error: 'You cannot remove your own super admin role.' });
		}

		await db
			.update(members)
			.set({ adminRole: adminRole || null, updatedAt: new Date() })
			.where(eq(members.id, id));

		return { success: true };
	},

	exportCsv: async () => {
		const allMembers = await db.select().from(members).orderBy(members.lastName);

		const header = 'First Name,Last Name,Email,Role,Verified,Astronomy,Physics,Year,Major,Event Preferences,Joined';
		const rows = allMembers.map((m) =>
			[
				m.firstName,
				m.lastName,
				m.email,
				m.role,
				m.emailVerified ? 'Yes' : 'No',
				m.astronomyMember ? 'Yes' : 'No',
				m.physicsMember ? 'Yes' : 'No',
				m.year || '',
				m.major || '',
				`"${(m.eventPreferences || []).join('; ')}"`,
				m.createdAt?.toISOString().split('T')[0] || ''
			].join(',')
		);

		return { csv: [header, ...rows].join('\n') };
	}
};
