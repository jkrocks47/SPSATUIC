export type FieldType = 'short' | 'long' | 'markdown';

export interface ContentEntry {
	slug: string;
	section: string;
	label: string;
	fieldType: FieldType;
	defaultTitle?: string;
	defaultBody?: string;
	page: string;
	clubSpecific: boolean;
}

// Defaults that differ per club
export const clubDefaults: Record<string, Record<string, { defaultTitle?: string; defaultBody?: string }>> = {
	// ── Homepage ──
	'home|hero-title': {
		astronomy: { defaultBody: 'OBSERVE THE COSMOS' },
		physics: { defaultBody: 'EXPLORE. DISCOVER. UNDERSTAND.' }
	},
	'home|hero-subtitle': {
		astronomy: {
			defaultBody:
				'University of Illinois Chicago — Exploring the universe from the urban canopy. EST. 2010.'
		},
		physics: {
			defaultBody:
				'We are a community of curious minds dedicated to understanding the fundamental principles that govern our universe. From quantum mechanics to astrophysics, we explore it all.'
		}
	},
	'home|hero-cta': {
		astronomy: { defaultBody: 'INITIATE OBSERVATION' },
		physics: { defaultBody: 'View Events' }
	},
	'home|events-subtitle': {
		astronomy: { defaultBody: 'HORIZONS' },
		physics: { defaultBody: "What's happening" }
	},
	'home|events-title': {
		astronomy: { defaultBody: 'UPCOMING EVENTS' },
		physics: { defaultBody: 'Upcoming Events' }
	},
	'home|gallery-subtitle': {
		astronomy: { defaultBody: 'ARCHIVE' },
		physics: { defaultBody: 'Visual archive' }
	},
	'home|gallery-title': {
		astronomy: { defaultBody: 'DEEP FIELD GALLERY' },
		physics: { defaultBody: 'Gallery' }
	},
	'home|about-subtitle': {
		astronomy: { defaultBody: 'ABOUT' },
		physics: { defaultBody: 'About us' }
	},
	'home|about-title': {
		astronomy: { defaultBody: 'About the Club' },
		physics: { defaultBody: 'Who We Are' }
	},
	'home|about-body': {
		astronomy: { defaultBody: '' },
		physics: {
			defaultBody:
				'The Society of Physics Students at UIC is a professional organization that aims to foster a love of physics among students. We host research talks, lab tours, study sessions, and social events throughout the academic year.'
		}
	},

	// ── About page ──
	'about|page-subtitle': {
		astronomy: { defaultBody: 'WHO WE ARE' },
		physics: { defaultBody: 'Who we are' }
	},
	'about|page-title': {
		astronomy: { defaultBody: 'ABOUT' },
		physics: { defaultBody: 'About SPS' }
	},
	'about|page-description': {
		astronomy: { defaultBody: 'UIC Astronomy Club' },
		physics: { defaultBody: 'Society of Physics Students at UIC' }
	},
	'about|history-body': {
		astronomy: {
			defaultBody:
				'Founded by a small group of passionate students, the UIC Astronomy Club has grown into one of the most active science organizations on campus. Over the years, we have hosted star parties, partnered with the Adler Planetarium, and participated in national astronomy events. Our community continues to grow as we inspire the next generation of astronomers and space enthusiasts.'
		},
		physics: {
			defaultBody:
				'Our chapter of the Society of Physics Students has been active at UIC for decades, fostering a community of curious minds and future physicists. We have hosted distinguished speakers, organized trips to national laboratories like Fermilab and Argonne, and supported students in their academic and research pursuits. Our alumni have gone on to careers in academia, industry, and beyond.'
		}
	},

	// ── Join page ──
	'join|page-subtitle': {
		astronomy: { defaultBody: 'UIC ASTRONOMY CLUB // MEMBERSHIP' },
		physics: { defaultBody: 'Get involved' }
	},
	'join|page-title': {
		astronomy: { defaultBody: 'JOIN THE OBSERVATORY' },
		physics: { defaultBody: 'Join SPS' }
	},
	'join|intro-text': {
		astronomy: {
			defaultBody:
				'No experience necessary. All UIC students are welcome regardless of major or year. Create an account to RSVP for events, access the gallery, and join the community.'
		},
		physics: { defaultBody: '' }
	},
	'join|benefit-1-title': {
		astronomy: { defaultBody: 'Observing Sessions' },
		physics: { defaultBody: 'Research Opportunities' }
	},
	'join|benefit-1-body': {
		astronomy: {
			defaultBody:
				'Telescope access and guided nights on campus rooftops and at dark sky sites.'
		},
		physics: {
			defaultBody:
				'Present your own research and learn about ongoing projects from peers and faculty.'
		}
	},
	'join|benefit-2-title': {
		astronomy: { defaultBody: 'Guest Lectures' },
		physics: { defaultBody: 'Lab Tours' }
	},
	'join|benefit-2-body': {
		astronomy: {
			defaultBody: 'Hear from astronomers, astrophysicists, and researchers at the frontier.'
		},
		physics: {
			defaultBody:
				'Visit national labs like Fermilab and Argonne, and explore cutting-edge facilities.'
		}
	},
	'join|benefit-3-title': {
		astronomy: { defaultBody: 'Workshops' },
		physics: { defaultBody: 'Study Groups' }
	},
	'join|benefit-3-body': {
		astronomy: {
			defaultBody:
				'Astrophotography, telescope operation, celestial navigation \u2014 hands on.'
		},
		physics: {
			defaultBody:
				'Collaborative study sessions and tutoring for physics courses at all levels.'
		}
	},
	'join|benefit-4-title': {
		astronomy: { defaultBody: 'Community' },
		physics: { defaultBody: 'Networking' }
	},
	'join|benefit-4-body': {
		astronomy: {
			defaultBody: 'Connect with fellow space enthusiasts. Build friendships under the stars.'
		},
		physics: {
			defaultBody:
				'Connect with faculty, alumni, and professionals through our events and national SPS network.'
		}
	},
	'join|cta-title': {
		astronomy: { defaultBody: 'Create Your Account' },
		physics: { defaultBody: 'Ready to join?' }
	},
	'join|cta-body': {
		astronomy: {
			defaultBody:
				"Register with your @uic.edu email to become a member. You'll be able to RSVP for events, manage your profile, and stay updated."
		},
		physics: {
			defaultBody:
				'SPS is open to all UIC students with an interest in physics, regardless of major. Come to a meeting or reach out to learn more.'
		}
	},

	// ── Contact page ──
	'contact|page-subtitle': {
		astronomy: { defaultBody: 'REACH OUT' },
		physics: { defaultBody: 'Reach out' }
	},
	'contact|page-title': {
		astronomy: { defaultBody: 'CONTACT' },
		physics: { defaultBody: 'Contact' }
	},
	'contact|contact-heading': {
		astronomy: { defaultBody: 'Get in Touch' },
		physics: { defaultBody: 'Get in Touch' }
	},
	'contact|form-heading': {
		astronomy: { defaultBody: 'Send a Message' },
		physics: { defaultBody: 'Send a Message' }
	},

	// ── Board page ──
	'board|page-subtitle': {
		astronomy: { defaultBody: 'OUR TEAM' },
		physics: { defaultBody: 'Our team' }
	},
	'board|page-title': {
		astronomy: { defaultBody: 'BOARD' },
		physics: { defaultBody: 'Board' }
	},
	'board|page-description': {
		astronomy: { defaultBody: 'Meet the people behind the club' },
		physics: { defaultBody: 'Meet the people behind the club' }
	},

	// ── Events page ──
	'events|page-subtitle': {
		astronomy: { defaultBody: 'OBSERVE' },
		physics: { defaultBody: 'Schedule' }
	},
	'events|page-title': {
		astronomy: { defaultBody: 'EVENTS' },
		physics: { defaultBody: 'Events' }
	},

	// ── Gallery page ──
	'gallery|page-subtitle': {
		astronomy: { defaultBody: 'ARCHIVE' },
		physics: { defaultBody: 'Visual archive' }
	},
	'gallery|page-title': {
		astronomy: { defaultBody: 'DEEP FIELD GALLERY' },
		physics: { defaultBody: 'Gallery' }
	}
};

// Content entries that are the same structure for both clubs
export const contentEntries: ContentEntry[] = [
	// ── Root Homepage (not club-specific) ──
	{
		slug: 'root-home',
		section: 'hero-tagline',
		label: 'Hero tagline on the main landing page',
		fieldType: 'short',
		defaultBody:
			'Exploring the fundamental laws of the universe, one experiment at a time.',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'about-subtitle',
		label: 'Section subtitle above "About SPS at UIC"',
		fieldType: 'short',
		defaultBody: 'SOCIETY OF PHYSICS STUDENTS',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'about-heading',
		label: 'Main about heading on landing page',
		fieldType: 'short',
		defaultBody: 'About SPS at UIC',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'history-lead',
		label: 'History lead text (italic intro line)',
		fieldType: 'long',
		defaultBody:
			'Our chapter has been active at UIC for decades, fostering a community of curious minds and future physicists.',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'history-body',
		label: 'History body paragraph',
		fieldType: 'long',
		defaultBody:
			'We have hosted distinguished speakers, organized trips to national laboratories like Fermilab and Argonne, and supported students in their academic and research pursuits. Our alumni have gone on to careers in academia, industry, and beyond.',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'stats-1',
		label: 'Stats strip \u2014 first item',
		fieldType: 'short',
		defaultBody: 'DECADES ACTIVE',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'stats-2',
		label: 'Stats strip \u2014 second item',
		fieldType: 'short',
		defaultBody: 'FERMILAB TRIPS',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'stats-3',
		label: 'Stats strip \u2014 third item',
		fieldType: 'short',
		defaultBody: 'ALL MAJORS WELCOME',
		page: 'Root Homepage',
		clubSpecific: false
	},
	{
		slug: 'root-home',
		section: 'footer-text',
		label: 'Footer text at bottom of landing page',
		fieldType: 'short',
		defaultBody: 'SPS + UIC + CHICAGO + EST. 2010',
		page: 'Root Homepage',
		clubSpecific: false
	},

	// ── Club Homepage ──
	{
		slug: 'home',
		section: 'hero-title',
		label: 'Hero title on the club homepage',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'hero-subtitle',
		label: 'Hero subtitle / description text',
		fieldType: 'long',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'hero-cta',
		label: 'Hero call-to-action button text',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'events-subtitle',
		label: 'Events section subtitle',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'events-title',
		label: 'Events section title',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'gallery-subtitle',
		label: 'Gallery section subtitle',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'gallery-title',
		label: 'Gallery section title',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'about-subtitle',
		label: 'About section subtitle',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'about-title',
		label: 'About section title',
		fieldType: 'short',
		page: 'Homepage',
		clubSpecific: true
	},
	{
		slug: 'home',
		section: 'about-body',
		label: 'About section body text',
		fieldType: 'long',
		page: 'Homepage',
		clubSpecific: true
	},

	// ── About Page ──
	{
		slug: 'about',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'About Page',
		clubSpecific: true
	},
	{
		slug: 'about',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'About Page',
		clubSpecific: true
	},
	{
		slug: 'about',
		section: 'page-description',
		label: 'Short description below title',
		fieldType: 'short',
		page: 'About Page',
		clubSpecific: true
	},
	{
		slug: 'about',
		section: 'history-body',
		label: 'History section text',
		fieldType: 'markdown',
		page: 'About Page',
		clubSpecific: true
	},

	// ── Join Page ──
	{
		slug: 'join',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'intro-text',
		label: 'Intro paragraph below title',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-1-title',
		label: 'Benefit card 1 \u2014 title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-1-body',
		label: 'Benefit card 1 \u2014 description',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-2-title',
		label: 'Benefit card 2 \u2014 title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-2-body',
		label: 'Benefit card 2 \u2014 description',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-3-title',
		label: 'Benefit card 3 \u2014 title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-3-body',
		label: 'Benefit card 3 \u2014 description',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-4-title',
		label: 'Benefit card 4 \u2014 title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'benefit-4-body',
		label: 'Benefit card 4 \u2014 description',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'cta-title',
		label: 'CTA section title',
		fieldType: 'short',
		page: 'Join Page',
		clubSpecific: true
	},
	{
		slug: 'join',
		section: 'cta-body',
		label: 'CTA section body text',
		fieldType: 'long',
		page: 'Join Page',
		clubSpecific: true
	},

	// ── Contact Page ──
	{
		slug: 'contact',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'Contact Page',
		clubSpecific: true
	},
	{
		slug: 'contact',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'Contact Page',
		clubSpecific: true
	},
	{
		slug: 'contact',
		section: 'contact-heading',
		label: '"Get in Touch" heading',
		fieldType: 'short',
		page: 'Contact Page',
		clubSpecific: true
	},
	{
		slug: 'contact',
		section: 'form-heading',
		label: '"Send a Message" form heading',
		fieldType: 'short',
		page: 'Contact Page',
		clubSpecific: true
	},

	// ── Board Page ──
	{
		slug: 'board',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'Board Page',
		clubSpecific: true
	},
	{
		slug: 'board',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'Board Page',
		clubSpecific: true
	},
	{
		slug: 'board',
		section: 'page-description',
		label: 'Description below title',
		fieldType: 'short',
		page: 'Board Page',
		clubSpecific: true
	},

	// ── Events Page ──
	{
		slug: 'events',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'Events Page',
		clubSpecific: true
	},
	{
		slug: 'events',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'Events Page',
		clubSpecific: true
	},

	// ── Gallery Page ──
	{
		slug: 'gallery',
		section: 'page-subtitle',
		label: 'Page subtitle',
		fieldType: 'short',
		page: 'Gallery Page',
		clubSpecific: true
	},
	{
		slug: 'gallery',
		section: 'page-title',
		label: 'Page title',
		fieldType: 'short',
		page: 'Gallery Page',
		clubSpecific: true
	}
];

/**
 * Get the default body for a given slug/section/club combination.
 * First checks clubDefaults, then falls back to the entry's defaultBody.
 */
export function getDefault(
	slug: string,
	section: string,
	clubType?: string
): { title?: string; body?: string } {
	const key = `${slug}|${section}`;
	const clubDef = clubType ? clubDefaults[key]?.[clubType] : undefined;
	if (clubDef) {
		return {
			title: clubDef.defaultTitle,
			body: clubDef.defaultBody
		};
	}

	const entry = contentEntries.find((e) => e.slug === slug && e.section === section);
	return {
		title: entry?.defaultTitle,
		body: entry?.defaultBody
	};
}

/**
 * Get all content entries for a given page group.
 */
export function getEntriesByPage(page: string): ContentEntry[] {
	return contentEntries.filter((e) => e.page === page);
}

/**
 * Get all unique page names in display order.
 */
export function getPageGroups(clubSpecific?: boolean): string[] {
	const seen = new Set<string>();
	const result: string[] = [];
	for (const entry of contentEntries) {
		if (clubSpecific !== undefined && entry.clubSpecific !== clubSpecific) continue;
		if (!seen.has(entry.page)) {
			seen.add(entry.page);
			result.push(entry.page);
		}
	}
	return result;
}
