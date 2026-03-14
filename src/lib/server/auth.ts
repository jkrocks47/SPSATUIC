import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { eq, and, gt } from 'drizzle-orm';
import { db } from './db';
import {
	members,
	memberSessions,
	emailVerificationTokens,
	passwordResetTokens
} from './db/schema';
import type { Role, MemberRole } from '$lib/utils/constants';

export interface MemberUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	displayName: string;
	role: MemberRole;
	adminRole: Role | null;
	emailVerified: boolean;
	astronomyMember: boolean;
	physicsMember: boolean;
}

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const VERIFICATION_TOKEN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const RESET_TOKEN_DURATION_MS = 60 * 60 * 1000; // 1 hour

// --- Shared ---

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

// --- Member Sessions ---

export async function createMemberSession(memberId: string): Promise<string> {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	await db.insert(memberSessions).values({
		id: token,
		memberId,
		expiresAt
	});

	return token;
}

export async function validateMemberSession(token: string): Promise<MemberUser | null> {
	const result = await db
		.select({
			sessionId: memberSessions.id,
			expiresAt: memberSessions.expiresAt,
			memberId: members.id,
			email: members.email,
			firstName: members.firstName,
			lastName: members.lastName,
			displayName: members.displayName,
			role: members.role,
			adminRole: members.adminRole,
			emailVerified: members.emailVerified,
			astronomyMember: members.astronomyMember,
			physicsMember: members.physicsMember
		})
		.from(memberSessions)
		.innerJoin(members, eq(memberSessions.memberId, members.id))
		.where(eq(memberSessions.id, token))
		.limit(1);

	if (result.length === 0) return null;

	const session = result[0];

	if (session.expiresAt < new Date()) {
		await db.delete(memberSessions).where(eq(memberSessions.id, token));
		return null;
	}

	// Sliding window
	const halfLife = SESSION_DURATION_MS / 2;
	const timeRemaining = session.expiresAt.getTime() - Date.now();
	if (timeRemaining < halfLife) {
		const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
		await db
			.update(memberSessions)
			.set({ expiresAt: newExpiry })
			.where(eq(memberSessions.id, token));
	}

	return {
		id: session.memberId,
		email: session.email,
		firstName: session.firstName,
		lastName: session.lastName,
		displayName: session.displayName,
		role: session.role,
		adminRole: session.adminRole,
		emailVerified: session.emailVerified,
		astronomyMember: session.astronomyMember,
		physicsMember: session.physicsMember
	};
}

export async function destroyMemberSession(token: string): Promise<void> {
	await db.delete(memberSessions).where(eq(memberSessions.id, token));
}

// --- Email Verification Tokens ---

export async function generateVerificationToken(memberId: string): Promise<string> {
	// Delete any existing tokens for this member
	await db
		.delete(emailVerificationTokens)
		.where(eq(emailVerificationTokens.memberId, memberId));

	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_DURATION_MS);

	await db.insert(emailVerificationTokens).values({
		memberId,
		token,
		expiresAt
	});

	return token;
}

export async function validateVerificationToken(
	token: string
): Promise<{ memberId: string } | null> {
	const result = await db
		.select()
		.from(emailVerificationTokens)
		.where(
			and(eq(emailVerificationTokens.token, token), gt(emailVerificationTokens.expiresAt, new Date()))
		)
		.limit(1);

	if (result.length === 0) return null;

	const record = result[0];

	// Mark member as verified
	await db.update(members).set({ emailVerified: true }).where(eq(members.id, record.memberId));

	// Delete the used token
	await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, record.id));

	return { memberId: record.memberId };
}

// --- Password Reset Tokens ---

export async function generatePasswordResetToken(memberId: string): Promise<string> {
	// Delete any existing unused tokens for this member
	await db
		.delete(passwordResetTokens)
		.where(and(eq(passwordResetTokens.memberId, memberId)));

	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + RESET_TOKEN_DURATION_MS);

	await db.insert(passwordResetTokens).values({
		memberId,
		token,
		expiresAt
	});

	return token;
}

export async function validatePasswordResetToken(
	token: string
): Promise<{ memberId: string } | null> {
	const result = await db
		.select()
		.from(passwordResetTokens)
		.where(
			and(
				eq(passwordResetTokens.token, token),
				gt(passwordResetTokens.expiresAt, new Date())
			)
		)
		.limit(1);

	if (result.length === 0) return null;

	const record = result[0];
	if (record.usedAt) return null;

	// Mark token as used
	await db
		.update(passwordResetTokens)
		.set({ usedAt: new Date() })
		.where(eq(passwordResetTokens.id, record.id));

	return { memberId: record.memberId };
}
