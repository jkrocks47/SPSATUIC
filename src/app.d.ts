import type { MemberUser } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			member: MemberUser | null;
		}
	}
}

export {};
