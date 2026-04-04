import { fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// --- Tier configuration ---
// Each tier defines a sliding window (seconds) and max allowed attempts within that window.

const TIER_CONFIG = {
	// Login, admin login, forgot-password: strict to block brute-force and email bombing
	'auth-strict': { windowSeconds: 15 * 60, maxAttempts: 5 },
	// Registration, reset-password: slightly relaxed for multi-field forms with typo retries
	'auth-moderate': { windowSeconds: 15 * 60, maxAttempts: 10 },
	// Contact forms: longer window to prevent persistent drip-feed spam
	'contact': { windowSeconds: 60 * 60, maxAttempts: 5 },
	// Event check-in: relaxed — many users share WiFi at events
	'checkin': { windowSeconds: 15 * 60, maxAttempts: 10 }
} as const;

export type RateLimitTier = keyof typeof TIER_CONFIG;

interface RateLimitEntry {
	count: number;
	resetAt: number; // Unix timestamp (ms)
}

// In-memory store keyed by "tier:ip"
const store = new Map<string, RateLimitEntry>();

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Periodic sweep to prevent unbounded memory growth.
 * Removes all expired entries every 5 minutes.
 */
export function startRateLimitCleanup() {
	if (cleanupInterval) return;
	cleanupInterval = setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of store) {
			if (now >= entry.resetAt) {
				store.delete(key);
			}
		}
	}, 5 * 60 * 1000);
}

export function stopRateLimitCleanup() {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
	}
}

/**
 * Check rate limit for a given request event and tier.
 * Returns fail(429) with retryAfter (seconds) if limit exceeded, null if allowed.
 *
 * Rate limit check happens BEFORE reading the request body so the server
 * can short-circuit without wasting resources parsing form data from abusive clients.
 */
export function checkRateLimit(event: RequestEvent, tier: RateLimitTier) {
	const config = TIER_CONFIG[tier];
	const ip = event.getClientAddress();
	const key = `${tier}:${ip}`;
	const now = Date.now();

	const entry = store.get(key);

	// No existing entry or window expired — start fresh
	if (!entry || now >= entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
		return null;
	}

	// Within window — increment and check
	entry.count++;

	if (entry.count > config.maxAttempts) {
		const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
		return fail(429, {
			error: `Too many requests. Please try again in ${formatRetryTime(retryAfter)}.`,
			retryAfter
		});
	}

	return null;
}

function formatRetryTime(seconds: number): string {
	if (seconds < 60) return `${seconds} seconds`;
	const minutes = Math.ceil(seconds / 60);
	return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
