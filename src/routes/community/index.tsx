import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	BarChart3,
	Building2,
	CreditCard,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { useId } from "react";

export const Route = createFileRoute("/community/")({
	component: CommunityDashboardPage,
});

const sections = [
	{
		to: "/community/tenants",
		title: "Tenants",
		description: "People and access within your community",
		icon: UsersRound,
	},
	{
		to: "/community/community",
		title: "Community",
		description: "Your facilities and shared spaces",
		icon: Building2,
	},
	{
		to: "/community/securities",
		title: "Securities",
		description: "Security personnel and their assignments",
		icon: ShieldCheck,
	},
	{
		to: "/community/subscription",
		title: "Subscription",
		description: "Your plan and billing details",
		icon: CreditCard,
	},
	{
		to: "/community/reports",
		title: "Reports",
		description: "Community activity and insights",
		icon: BarChart3,
	},
] as const;

function CommunityDashboardPage() {
	const workspaceHeadingId = useId();
	return (
		<div className="space-y-8">
			<div className="max-w-2xl space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Community dashboard
				</h1>
				<p className="text-base text-base-content/70">
					Manage your community, the people in it, and the team keeping it
					secure.
				</p>
			</div>

			<section aria-labelledby={workspaceHeadingId} className="space-y-4">
				<h2 id={workspaceHeadingId} className="text-lg font-semibold">
					Your workspace
				</h2>
				<div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
					{sections.map(({ to, title, description, icon: Icon }, index) => (
						<Link
							key={to}
							to={to}
							className={`flex items-center gap-4 px-5 py-5 transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-6 ${index > 0 ? "border-t border-base-300" : ""}`}
						>
							<span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Icon aria-hidden="true" className="size-5" />
							</span>
							<span className="min-w-0 flex-1">
								<span className="block font-semibold">{title}</span>
								<span className="block text-sm text-base-content/70">
									{description}
								</span>
							</span>
							<ArrowUpRight
								aria-hidden="true"
								className="size-5 shrink-0 text-base-content/55"
							/>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
