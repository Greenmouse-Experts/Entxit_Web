import { describe, expect, it } from "vitest";
import type { AuthUser } from "@/store/authStore";
import { isAdminSession } from "./auth-guards";

const session = (userType: string, role?: string): AuthUser => ({
	accessToken: "token",
	user: { id: "user-1", email: "user@example.com", userType, role },
});

describe("dashboard admin access", () => {
	it("rejects missing sessions and credentials", () => {
		expect(isAdminSession(null)).toBe(false);
		expect(isAdminSession({ ...session("admin"), accessToken: "" })).toBe(
			false,
		);
		expect(
			isAdminSession({
				...session("admin"),
				user: { ...session("admin").user, id: "" },
			}),
		).toBe(false);
	});

	it("accepts admin roles and rejects other or conflicting roles", () => {
		expect(isAdminSession(session("admin"))).toBe(true);
		expect(isAdminSession(session("superadmin"))).toBe(true);
		expect(isAdminSession(session("super_admin"))).toBe(true);
		expect(isAdminSession(session("subadmin"))).toBe(false);
		expect(isAdminSession(session("admin", "staff"))).toBe(false);
		expect(isAdminSession(session("unknown"))).toBe(false);
		expect(isAdminSession(session(""))).toBe(false);
	});
});
