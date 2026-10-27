import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CreditCard,
	Megaphone,
	Settings2,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { useId } from "react";
import { useCommunityDetails } from "@/components/community/CommunityDetailsContext";

export const Route = createFileRoute("/community/community/$communityId/")({
	component: CommunityOverview,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

function CommunityOverview() {
	const community = useCommunityDetails();
	const detailsHeadingId = useId();
	const linksHeadingId = useId();
	const created = community.createdAt ? new Date(community.createdAt) : null;
	const createdLabel =
		created && !Number.isNaN(created.getTime())
			? dateFormatter.format(created)
			: "—";

	return (
		<div className="space-y-7">
			<section
				aria-label="Community statistics"
				className="grid overflow-hidden rounded-box border border-base-300 bg-base-100 sm:grid-cols-3"
			>
				{[
					{
						label: "Members",
						value: community.totalMembers?.toLocaleString() ?? "—",
						icon: UsersRound,
					},
					{
						label: "Security guards",
						value: community.totalGuards?.toLocaleString() ?? "—",
						icon: ShieldCheck,
					},
					{ label: "Created", value: createdLabel, icon: null },
				].map(({ label, value, icon: Icon }, index) => (
					<div
						key={label}
						className={`flex items-start justify-between gap-4 p-6 ${index > 0 ? "border-t border-base-300 sm:border-l sm:border-t-0" : ""}`}
					>
						<div>
							<p className="text-sm text-base-content/70">{label}</p>
							<p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">
								{value}
							</p>
						</div>
						{Icon && (
							<Icon
								aria-hidden="true"
								className="size-5 shrink-0 text-primary"
							/>
						)}
					</div>
				))}
			</section>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,1fr)]">
				<section
					aria-labelledby={detailsHeadingId}
					className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-7"
				>
					<h2 id={detailsHeadingId} className="text-xl font-semibold">
						Community details
					</h2>
					<p className="mt-1 text-sm text-base-content/70">
						Information currently on record.
					</p>
					<dl className="mt-6 divide-y divide-base-300 border-y border-base-300">
						{[
							{ label: "Category", value: community.hostCategoryName },
							{ label: "Address", value: community.address },
							{ label: "State", value: community.state },
							{ label: "Description", value: community.description },
						].map(({ label, value }) => (
							<div
								key={label}
								className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4"
							>
								<dt className="text-sm text-base-content/65">{label}</dt>
								<dd className="text-sm font-medium leading-6">
									{value || "Not provided"}
								</dd>
							</div>
						))}
					</dl>
					<Link
						to="/community/settings"
						search={{ communityId: community.id }}
						className="btn btn-outline btn-sm mt-6 gap-2"
					>
						<Settings2 aria-hidden="true" className="size-4" /> Community
						settings
					</Link>
				</section>

				<section
					aria-labelledby={linksHeadingId}
					className="rounded-box bg-primary p-6 text-primary-content sm:p-7"
				>
					<h2 id={linksHeadingId} className="text-xl font-semibold">
						Manage this community
					</h2>
					<p className="mt-1 text-sm text-primary-content/80">
						Open the work for {community.name}.
					</p>
					<div className="mt-6 divide-y divide-primary-content/20 border-y border-primary-content/20">
						<Link
							to="/community/community/$communityId/announcements"
							params={{ communityId: community.id }}
							className="flex min-h-14 items-center gap-3 py-3 text-sm font-medium hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content"
						>
							<Megaphone aria-hidden="true" className="size-5" />{" "}
							<span className="flex-1">Announcements</span>
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
						<Link
							to="/community/community/$communityId/tenants"
							params={{ communityId: community.id }}
							className="flex min-h-14 items-center gap-3 py-3 text-sm font-medium hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content"
						>
							<UsersRound aria-hidden="true" className="size-5" />{" "}
							<span className="flex-1">Tenants</span>
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
						<Link
							to="/community/subscription"
							search={{ communityId: community.id }}
							className="flex min-h-14 items-center gap-3 py-3 text-sm font-medium hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content"
						>
							<CreditCard aria-hidden="true" className="size-5" />{" "}
							<span className="flex-1">Subscription</span>
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
