import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	Building2,
	LayoutDashboard,
	LogOut,
	Menu,
	ShieldCheck,
	UsersRound,
	X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/community")({
	component: CommunityLayout,
});

const navigation = [
	{ to: "/community", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/community/tenants", label: "Tenants", icon: UsersRound },
	{ to: "/community/community", label: "Community", icon: Building2 },
	{ to: "/community/securities", label: "Securities", icon: ShieldCheck },
] as const;

interface SidebarContentProps {
	onNavigate?: () => void;
	onLogout: () => void;
	isLoggingOut: boolean;
}

function SidebarContent({
	onNavigate,
	onLogout,
	isLoggingOut,
}: SidebarContentProps) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-20 items-center gap-3 border-b border-base-300 px-6">
				<div className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-content">
					E
				</div>
				<div className="leading-tight">
					<p className="text-lg font-bold text-base-content">EntXit</p>
					<p className="text-xs text-base-content/65">Community portal</p>
				</div>
			</div>

			<nav
				aria-label="Community navigation"
				className="flex-1 space-y-1 px-3 py-6"
			>
				{navigation.map(({ to, label, icon: Icon }) => (
					<Link
						key={to}
						to={to}
						onClick={onNavigate}
						activeOptions={{ exact: true }}
						className="flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
						activeProps={{
							className: "bg-primary/10 text-primary hover:bg-primary/15",
						}}
					>
						<Icon aria-hidden="true" className="size-5 shrink-0" />
						<span>{label}</span>
					</Link>
				))}
			</nav>

			<div className="border-t border-base-300 p-3">
				<button
					type="button"
					onClick={onLogout}
					disabled={isLoggingOut}
					className="flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-medium text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
				>
					<LogOut aria-hidden="true" className="size-5" />
					{isLoggingOut ? "Signing out…" : "Sign out"}
				</button>
			</div>
		</div>
	);
}

function CommunityLayout() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { user, logout, isLoggingOut } = useAuth();
	const name =
		[user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
		user?.name ||
		user?.email ||
		"Community member";
	const initial = name.charAt(0).toUpperCase();

	return (
		<div className="min-h-screen bg-base-200 text-base-content">
			<aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-base-300 bg-base-100 lg:block">
				<SidebarContent onLogout={() => logout()} isLoggingOut={isLoggingOut} />
			</aside>

			<Dialog
				open={menuOpen}
				onClose={setMenuOpen}
				className="relative z-50 lg:hidden"
			>
				<DialogBackdrop className="fixed inset-0 bg-neutral/50" />
				<DialogPanel className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-base-100 shadow-xl">
					<DialogTitle className="sr-only">Community navigation</DialogTitle>
					<button
						type="button"
						aria-label="Close navigation"
						onClick={() => setMenuOpen(false)}
						className="btn btn-ghost btn-square absolute right-3 top-4 z-10"
					>
						<X aria-hidden="true" className="size-5" />
					</button>
					<SidebarContent
						onNavigate={() => setMenuOpen(false)}
						onLogout={() => logout()}
						isLoggingOut={isLoggingOut}
					/>
				</DialogPanel>
			</Dialog>

			<div className="lg:pl-64">
				<header className="flex h-20 items-center justify-between border-b border-base-300 bg-base-100 px-4 sm:px-8">
					<div className="flex items-center gap-3">
						<button
							type="button"
							aria-label="Open navigation"
							onClick={() => setMenuOpen(true)}
							className="btn btn-ghost btn-square lg:hidden"
						>
							<Menu aria-hidden="true" className="size-5" />
						</button>
						<p className="text-sm font-semibold text-base-content/70">
							Community workspace
						</p>
					</div>
					<div className="flex min-w-0 items-center gap-3">
						<span className="hidden max-w-48 truncate text-sm font-medium sm:block">
							{name}
						</span>
						<span
							aria-hidden="true"
							className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
						>
							{initial}
						</span>
					</div>
				</header>
				<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
