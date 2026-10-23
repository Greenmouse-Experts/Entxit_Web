import type { AuthUser } from "@/store/authStore";

export function isAdminSession(session: AuthUser | null): boolean {
	if (!session?.accessToken || !session.user?.id) return false;
	const role = (session.user.role ?? session.user.userType)?.toLowerCase();
	return role === "admin" || role === "superadmin" || role === "super_admin";
}
