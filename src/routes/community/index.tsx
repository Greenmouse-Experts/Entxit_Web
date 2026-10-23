import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Building2,
	MapPin,
	Megaphone,
	Settings2,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { useId } from "react";
import { demoCommunities } from "@/data/demo.community";
import type { SubadminCommunity } from "@/services/types";

type CommunitySearch = { communityId?: string };

export const Route = createFileRoute("/community/")({
	validateSearch: (search: Record<string, unknown>): CommunitySearch => ({
		communityId:
			typeof search.communityId === "string" && search.communityId.trim()
				? search.communityId.trim()
				: undefined,
	}),
	component: CommunityDashboardPage,
});

const count = (value?: number) =>
	typeof value === "number" ? value.toLocaleString() : "—";

function CommunityDashboardPage() {
	const navigate = Route.useNavigate();
	const { communityId } = Route.useSearch();
	const selected =
		demoCommunities.find((community) => community.id === communityId) ??
		demoCommunities[0];

	return (
		<CommunityOverview
			community={selected}
			communities={demoCommunities}
			onSelect={(id) =>
				navigate({ search: { communityId: id }, replace: true })
			}
		/>
	);
}

function CommunityOverview({
	community,
	communities,
	onSelect,
}: {
	community: SubadminCommunity;
	communities: SubadminCommunity[];
	onSelect: (id: string) => void;
}) {
	const detailsHeadingId = useId();
	const nextStepsHeadingId = useId();
	const location = [community.address, community.state]
		.filter(Boolean)
		.join(", ");
	const status = community.status ?? "Unknown";
	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							{community.name}
						</h1>
						<span className="badge badge-outline badge-sm">Demo data</span>
					</div>
					<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
						A clear view of your people, security team, and community details.
					</p>
				</div>
				{communities.length > 1 && (
					<label className="flex min-w-52 flex-col gap-1.5 text-xs font-medium text-base-content/70">
						Community
						<select
							className="select select-bordered w-full bg-base-100 text-sm text-base-content"
							value={community.id}
							onChange={(event) => onSelect(event.target.value)}
						>
							{communities.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
					</label>
				)}
			</div>

			<section
				aria-label="Community statistics"
				className="grid overflow-hidden rounded-box border border-base-300 bg-base-100 sm:grid-cols-3"
			>
				{[
					{
						label: "Members",
						value: count(community.totalMembers),
						icon: UsersRound,
					},
					{
						label: "Security guards",
						value: count(community.totalGuards),
						icon: ShieldCheck,
					},
					{
						label: "Managed communities",
						value: count(communities.length),
						icon: Building2,
					},
				].map(({ label, value, icon: Icon }, index) => (
					<div
						key={label}
						className={`flex items-start justify-between gap-4 p-6 ${index > 0 ? "border-t border-base-300 sm:border-l sm:border-t-0" : ""}`}
					>
						<div>
							<p className="text-sm text-base-content/70">{label}</p>
							<p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">
								{value}
							</p>
						</div>
						<Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
					</div>
				))}
			</section>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,1fr)]">
				<section
					className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-7"
					aria-labelledby={detailsHeadingId}
				>
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div>
							<h2 id={detailsHeadingId} className="text-xl font-semibold">
								Community overview
							</h2>
							<p className="mt-1 text-sm text-base-content/70">
								The details currently on record.
							</p>
						</div>
						<span
							className={`badge badge-soft capitalize ${status.toLowerCase() === "active" ? "badge-success" : "badge-warning"}`}
						>
							{status}
						</span>
					</div>
					<dl className="mt-6 divide-y divide-base-300 border-y border-base-300">
						{[
							{ label: "Category", value: community.hostCategoryName },
							{ label: "Location", value: location },
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
						className="btn btn-outline btn-sm mt-6 gap-2"
					>
						<Settings2 aria-hidden="true" className="size-4" /> Community
						settings
					</Link>
				</section>

				<section
					className="rounded-box bg-primary p-6 text-primary-content sm:p-7"
					aria-labelledby={nextStepsHeadingId}
				>
					<h2 id={nextStepsHeadingId} className="text-xl font-semibold">
						Keep things moving
					</h2>
					<p className="mt-1 text-sm text-primary-content/80">
						Go straight to the work that matters today.
					</p>
					<div className="mt-6 divide-y divide-primary-content/20 border-y border-primary-content/20">
						{(
							[
								{
									to: "/community/tenants",
									label: "Manage tenants",
									icon: UsersRound,
								},
								{
									to: "/community/securities",
									label: "Review security",
									icon: ShieldCheck,
								},
								{
									to: "/community/announcements",
									label: "Announcements",
									icon: Megaphone,
								},
							] as const
						).map(({ to, label, icon: Icon }) => (
							<Link
								key={to}
								to={to}
								className="flex min-h-14 items-center gap-3 py-3 text-sm font-medium transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-content"
							>
								<Icon aria-hidden="true" className="size-5" />
								<span className="flex-1">{label}</span>
								<ArrowRight aria-hidden="true" className="size-4" />
							</Link>
						))}
					</div>
					{location && (
						<p className="mt-6 flex items-start gap-2 text-xs text-primary-content/75">
							<MapPin aria-hidden="true" className="size-4 shrink-0" />
							{location}
						</p>
					)}
				</section>
			</div>
		</div>
	);
}
