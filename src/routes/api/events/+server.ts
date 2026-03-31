import { json } from '@sveltejs/kit';
import { eq, and, gte, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const club = url.searchParams.get('club');
	const limit = parseInt(url.searchParams.get('limit') || '20');

	const conditions = [eq(events.isPublished, true), gte(events.date, new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' }))];

	if (club === 'astronomy' || club === 'physics') {
		conditions.push(eq(events.clubType, club));
	}

	const result = await db
		.select()
		.from(events)
		.where(and(...conditions))
		.orderBy(asc(events.date))
		.limit(Math.min(limit, 50));

	return json(result);
};
