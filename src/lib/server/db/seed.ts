import { randomBytes } from 'crypto';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { hashPassword } from '../auth';
import { members, clubInfo, pageContent } from './schema';
import { contentEntries, clubDefaults } from '$lib/utils/content-registry';

async function seed() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!email || !password) {
		console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
		process.exit(1);
	}

	const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
	const db = drizzle(pool);

	const passwordHash = await hashPassword(password);

	await db
		.insert(members)
		.values({
			email,
			passwordHash,
			firstName: 'Admin',
			lastName: 'User',
			displayName: 'Admin',
			role: 'member',
			adminRole: 'super_admin',
			emailVerified: true,
			unsubscribeToken: randomBytes(32).toString('hex')
		})
		.onConflictDoNothing();

	// Seed club info
	await db
		.insert(clubInfo)
		.values([
			{
				clubType: 'astronomy',
				aboutText: 'UIC Astronomy Club — Exploring the universe from the urban canopy since 2010.',
				meetingInfo: 'Meetings every Thursday at 6 PM in SES 238',
				contactEmail: 'astro@uic.edu',
				socialLinks: { instagram: 'UICAstronomyClub', twitter: 'UICAstronomyClub' }
			},
			{
				clubType: 'physics',
				aboutText: 'UIC Physics Club — Advancing physics education and community at UIC.',
				meetingInfo: 'Meetings every Tuesday at 5 PM in SES 238',
				contactEmail: 'sps@uic.edu',
				socialLinks: { instagram: 'UICPhysicsClub' }
			}
		])
		.onConflictDoNothing();

	// Seed page content defaults
	const contentRows: {
		slug: string;
		clubType: 'astronomy' | 'physics' | null;
		section: string;
		title: string | null;
		body: string | null;
	}[] = [];

	for (const entry of contentEntries) {
		if (entry.clubSpecific) {
			// Create a row for each club
			for (const club of ['astronomy', 'physics'] as const) {
				const key = `${entry.slug}|${entry.section}`;
				const clubDef = clubDefaults[key]?.[club];
				contentRows.push({
					slug: entry.slug,
					clubType: club,
					section: entry.section,
					title: clubDef?.defaultTitle ?? entry.defaultTitle ?? null,
					body: clubDef?.defaultBody ?? entry.defaultBody ?? null
				});
			}
		} else {
			// Root homepage content — no club type
			contentRows.push({
				slug: entry.slug,
				clubType: null,
				section: entry.section,
				title: entry.defaultTitle ?? null,
				body: entry.defaultBody ?? null
			});
		}
	}

	if (contentRows.length > 0) {
		await db.insert(pageContent).values(contentRows).onConflictDoNothing();
	}

	console.log(`Seed complete: admin member, club info, and ${contentRows.length} content blocks created.`);
	await pool.end();
}

seed().catch(console.error);
