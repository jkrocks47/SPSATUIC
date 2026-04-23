import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
});

export const eventSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	description: z.string().optional(),
	date: z.string().min(1, 'Date is required'),
	time: z.string().optional(),
	location: z.string().optional(),
	locationUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
	clubType: z.enum(['astronomy', 'physics']),
	isPublished: z.boolean().default(true),
	rsvpRequired: z.boolean().default(false),
	maxAttendees: z.number().int().positive().optional()
});

// Member registration (multi-step)
export const registrationSchema = z.object({
	email: z
		.string()
		.email('Invalid email address')
		.refine((e) => e.endsWith('@uic.edu'), 'Must be a @uic.edu email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number'),
	firstName: z.string().min(1, 'First name is required').max(100),
	lastName: z.string().min(1, 'Last name is required').max(100),
	year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Faculty']).optional(),
	major: z.string().max(200).optional(),
	astronomyMember: z.boolean().default(false),
	physicsMember: z.boolean().default(false),
	eventPreferences: z.array(z.string()).optional()
});

export const memberLoginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required')
});

export const profileUpdateSchema = z.object({
	firstName: z.string().min(1, 'First name is required').max(100),
	lastName: z.string().min(1, 'Last name is required').max(100),
	secondaryEmail: z.string().email('Invalid email address').max(254).optional().or(z.literal('')),
	year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Faculty']).optional(),
	major: z.string().max(200).optional(),
	astronomyMember: z.boolean().default(false),
	physicsMember: z.boolean().default(false),
	eventPreferences: z.array(z.string()).optional(),
	emailOptOut: z.boolean().default(false)
});

export const rsvpSchema = z.object({
	eventId: z.string().uuid('Invalid event ID'),
	status: z.enum(['going', 'maybe', 'not_going'])
});

export const announcementSchema = z.object({
	title: z.string().min(1, 'Title is required').max(200),
	body: z.string().min(1, 'Body is required'),
	clubType: z.enum(['astronomy', 'physics']).optional(),
	isPinned: z.boolean().default(false),
	publishAt: z.string().optional(),
	expiresAt: z.string().optional()
});

export const passwordResetRequestSchema = z.object({
	email: z.string().email('Invalid email address')
});

export const passwordResetSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
});

export const galleryImageSchema = z.object({
	caption: z.string().optional(),
	clubType: z.enum(['astronomy', 'physics']),
	photographer: z.string().optional(),
	raCoord: z.string().max(300).optional(),
	decCoord: z.string().max(300).optional(),
	exposureTime: z.string().max(300).optional(),
	equipment: z.string().max(300).optional(),
	iso: z.string().max(300).optional(),
	aperture: z.string().max(300).optional(),
	observationDate: z.string().max(300).optional()
});

export const officerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	position: z.string().min(1, 'Position is required'),
	email: z.string().email().optional().or(z.literal('')),
	bio: z.string().optional(),
	clubType: z.enum(['astronomy', 'physics']),
	sortOrder: z.number().int().default(0),
	academicYear: z.string().optional(),
	memberId: z.string().uuid().optional().or(z.literal(''))
});

export const checkinQuestionSchema = z.object({
	id: z.string().min(1),
	question: z.string().min(1, 'Question text is required').max(500),
	type: z.enum(['text', 'select', 'checkbox']),
	options: z.array(z.string()).optional(),
	required: z.boolean().default(false)
});

export const checkinQuestionsArraySchema = z.array(checkinQuestionSchema).max(10);

export const contentSchema = z.object({
	slug: z.string().min(1),
	clubType: z.enum(['astronomy', 'physics']),
	section: z.string().min(1),
	title: z.string().optional(),
	body: z.string().optional(),
	sortOrder: z.number().int().default(0)
});
