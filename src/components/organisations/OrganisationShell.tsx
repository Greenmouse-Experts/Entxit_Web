import { Link } from "@tanstack/react-router";
import {
	Bell,
	Building2,
	FileCheck2,
	HousePlus,
	UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const sections = [
	{ to: "/dashboard/organisations", label: "Communities", icon: Building2 },
	{ to: "/dashboard/organisations/hosts", label: "Hosts", icon: UsersRound },
	{ to: "/dashboard/organisations/alerts", label: "Alerts", icon: Bell },
	{
		to: "/dashboard/organisations/kyc",
		label: "KYC reviews",
		icon: FileCheck2,
	},
	{ to: "/dashboard/organisations/types", label: "Types", icon: HousePlus },
] as const;

export function OrganisationShell({
	title,
	description,
	actions,
	children,
}: {
	title: string;
	description: string;
	actions?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="space-y-6">
			<header className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-xs font-semibold uppercase tracking-widest text-primary">
						Organisation management
					</p>
					<h1 className="mt-1 text-3xl font-bold tracking-tight text-base-content">
						{title}
					</h1>
					<p className="mt-2 max-w-2xl text-sm text-base-content/70">
						{description}
					</p>
				</div>
				{actions}
			</header>
			<nav
				aria-label="Organisation sections"
				className="flex flex-wrap gap-1 border-b border-base-300"
			>
				{sections.map(({ to, label, icon: Icon }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact: true }}
						className="inline-flex items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm font-medium text-base-content/65 hover:text-base-content"
						activeProps={{ className: "border-primary text-primary" }}
					>
						<Icon aria-hidden="true" className="size-4" />
						{label}
					</Link>
				))}
			</nav>
			{children}
		</div>
	);
}
