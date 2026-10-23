import {
	createFileRoute,
	Navigate,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { isAdminSession } from "@/lib/auth-guards";
import { get_user_value, useAuth } from "@/store/authStore";

export const Route = createFileRoute("/dashboard")({
	ssr: false,
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const session = get_user_value();
		if (!session) throw redirect({ to: "/auth/login" });
		if (!isAdminSession(session)) throw redirect({ to: "/" });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [session] = useAuth();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;
	if (!session?.accessToken) return <Navigate to="/auth/login" />;
	if (!isAdminSession(session)) return <Navigate to="/" />;

	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}
