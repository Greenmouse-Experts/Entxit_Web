import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	BarChart3,
	Bell,
	Building2,
	CreditCard,
	FileText,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
	children: ReactNode;
}

const menuItems = [
	{ icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
	{ icon: Building2, label: "Organisations", href: "/dashboard/organisations" },
	{ icon: Users, label: "EntXit Logs", href: "/dashboard/users" },
	{
		icon: CreditCard,
		label: "Subscription & Billing",
		href: "/dashboard/subscriptions",
	},
	{ icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
	{
		icon: AlertTriangle,
		label: "Security Alerts",
		href: "/dashboard/alerts",
	},
	{
		icon: BarChart3,
		label: "Reports & Analytics",
		href: "/dashboard/reports",
	},
	{ icon: Settings, label: "Settings", href: "/dashboard/settings" },
	{ icon: FileText, label: "Audit Logs", href: "/dashboard/audit-logs" },
	{ icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { logout, isLoggingOut } = useAuth();

	return (
		<div className="min-h-screen bg-base-200">
			{/* Top Navigation Bar */}
			<nav className="fixed top-0 z-50 w-full bg-base-100 border-b border-base-300">
				<div className="px-4 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								type="button"
								onClick={() => setIsSidebarOpen((open) => !open)}
								className="btn btn-ghost btn-square p-2 text-base-content lg:hidden"
								aria-label={
									isSidebarOpen ? "Close navigation" : "Open navigation"
								}
								aria-expanded={isSidebarOpen}
							>
								<Menu className="w-6 h-6" />
							</button>
							<div className="flex items-center gap-2">
								<div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
									<span className="text-xl font-bold text-primary-content">
										E
									</span>
								</div>
								<div>
									<h1 className="text-xl font-bold text-base-content">
										EntXit
									</h1>
									<p className="text-xs text-base-content/60">
										Super Admin Portal
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<button
								type="button"
								className="btn btn-ghost btn-square relative text-base-content/70"
								aria-label="Notifications"
							>
								<Bell className="w-5 h-5" />
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
							</button>
							<div className="flex items-center gap-3 pl-4 border-l">
								<div className="text-right hidden sm:block">
									<p className="text-sm font-medium text-base-content">
										Admin User
									</p>
									<p className="text-xs text-base-content/60">Super Admin</p>
								</div>
								<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-content font-semibold">
									AU
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-base-100 border-r border-base-300",
					isSidebarOpen ? "translate-x-0" : "-translate-x-full",
					"lg:translate-x-0",
				)}
			>
				<div className="h-full px-3 pb-4 overflow-y-auto">
					<ul className="space-y-1 font-medium">
						{menuItems.map((item) => (
							<li key={item.href}>
								<Link
									to={item.href}
									className="flex items-center gap-3 p-3 text-base-content/80 rounded-lg hover:bg-base-200 group transition-colors cursor-pointer"
									onClick={() => setIsSidebarOpen(false)}
									activeProps={{
										className:
											"bg-primary/10 text-primary hover:bg-primary/15 font-semibold",
									}}
									activeOptions={{
										exact: item.href === "/dashboard",
									}}
								>
									<item.icon className="w-5 h-5 flex-shrink-0" />
									<span className="flex-1">{item.label}</span>
								</Link>
							</li>
						))}
					</ul>

					<div className="mt-6 pt-6 border-t border-base-300">
						<button
							type="button"
							onClick={() => logout()}
							disabled={isLoggingOut}
							className="flex items-center gap-3 w-full p-3 text-error rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<LogOut className="w-5 h-5" />
							<span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
						</button>
					</div>
				</div>
			</aside>

			{/* Mobile sidebar backdrop */}
			{isSidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-neutral/50 lg:hidden"
					aria-hidden="true"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Main content */}
			<main className={cn("pt-20 transition-all", "lg:ml-64")}>
				<div className="p-4 sm:p-6 lg:p-8">{children}</div>
			</main>
		</div>
	);
};
