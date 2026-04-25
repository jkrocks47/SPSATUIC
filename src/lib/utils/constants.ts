export const CLUB_TYPES = ['astronomy', 'physics'] as const;
export type ClubType = (typeof CLUB_TYPES)[number];

export const ROLES = ['super_admin', 'astronomy_admin', 'physics_admin', 'physics_faculty'] as const;
export type Role = (typeof ROLES)[number];

export const MEMBER_ROLES = ['member', 'board'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const RSVP_STATUSES = ['going', 'maybe', 'not_going'] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Faculty'] as const;
export type Year = (typeof YEARS)[number];

export const ACTIVE_MEMBER_THRESHOLD = 3;

export const SITE_NAME = 'UICSpacetime';
export const SITE_DESCRIPTION =
	'Society of Physics Students at the University of Illinois Chicago — Astronomy & Physics Clubs';

export const UIC_COORDINATES = {
	lat: 41.8708,
	lng: -87.6505,
	display: '41.8708° N, 87.6505° W'
};

/** Fallback contact emails — used only when no contactEmail is set in club_info table */
export const CONTACT_EMAILS = ['mwell8@uic.edu', 'uicastronomyclub@gmail.com'];

export function canManageClub(role: Role | null, club: ClubType): boolean {
	if (!role) return false;
	if (role === 'super_admin') return true;
	if (role === 'astronomy_admin' && club === 'astronomy') return true;
	if (role === 'physics_admin' && club === 'physics') return true;
	if (role === 'physics_faculty' && club === 'physics') return true;
	return false;
}

export function canManageClubContent(role: Role | null, club: ClubType): boolean {
	if (!role) return false;
	if (role === 'super_admin') return true;
	if (role === 'astronomy_admin' && club === 'astronomy') return true;
	if (role === 'physics_admin' && club === 'physics') return true;
	return false;
}
