import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CommunitiesAnalytics } from "@/components/community/CommunitiesAnalytics";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { subadminService } from "@/services/subadmin.service";
import type { SubadminCommunity } from "@/services/types";

type CommunitiesSearch = { q?: string; page?: number; pageSize?: number };

export const Route = createFileRoute("/community/")({
	validateSearch: (search: Record<string, unknown>): CommunitiesSearch => ({
		q: textParam(search.q),
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: CommunityDashboardPage,
});

const columns: columnType<SubadminCommunity>[] = [
	{
		key: "name",
		label: "Community",
		render: (_, community) => (
			<div className="min-w-48">
				<Link
					to="/community/community/$communityId"
					params={{ communityId: community.id }}
					className="font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					{community.name}
				</Link>
				{community.address && (
					<p className="mt-1 text-xs text-base-content/70">
						{community.address}
					</p>
				)}
			</div>
		),
	},
	{
		key: "hostCategoryName",
		label: "Category",
		render: (_, item) => item.hostCategoryName || "—",
	},
	{ key: "state", label: "State", render: (_, item) => item.state || "—" },
	{
		key: "totalMembers",
		label: "Members",
		render: (_, item) => item.totalMembers?.toLocaleString() ?? "—",
	},
	{
		key: "totalGuards",
		label: "Guards",
		render: (_, item) => item.totalGuards?.toLocaleString() ?? "—",
	},
	{
		key: "status",
		label: "Status",
		render: (_, item) =>
			item.status ? (
				<span
					className={`badge badge-soft badge-sm capitalize ${item.status.toLowerCase() === "active" ? "badge-success" : "badge-warning"}`}
				>
					{item.status}
				</span>
			) : (
				"—"
			),
	},
];

const actions: Actions<SubadminCommunity>[] = [
	{
		key: "overview",
		label: "View community",
		action: (item, navigate) =>
			navigate({
				to: "/community/community/$communityId",
				params: { communityId: item.id },
			}),
	},
	{
		key: "announcements",
		label: "Announcements",
		action: (item, navigate) =>
			navigate({
				to: "/community/community/$communityId/announcements",
				params: { communityId: item.id },
			}),
	},
];

function CommunityDashboardPage() {
	const navigate = Route.useNavigate();
	const { q = "", page = 1, pageSize = 10 } = Route.useSearch();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<div className="space-y-7">
			<div className="space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Community dashboard
				</h1>
				<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
					An overview of the communities you manage.
				</p>
			</div>
			<PageLoader
				query={communitiesQuery}
				loadingText="Loading your communities..."
			>
				{(response) => {
					const query = q.trim().toLowerCase();
					const filtered = response.payload.data.filter((community) =>
						[
							community.name,
							community.hostCategoryName,
							community.address,
							community.state,
						].some((value) => value?.toLowerCase().includes(query)),
					);
					const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
					const currentPage = Math.min(page, totalPages);
					const rows = filtered.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize,
					);
					return (
						<div className="space-y-8">
							<CommunitiesAnalytics communities={response.payload.data} />
							<section aria-label="Managed communities" className="space-y-4">
								<div className="flex flex-wrap items-end justify-between gap-4">
									<div>
										<h2 className="text-xl font-semibold">
											Managed communities
										</h2>
										<p className="mt-1 text-sm text-base-content/70">
											Search and open the communities assigned to your account.
										</p>
									</div>
									<label className="input input-bordered flex w-full items-center gap-2 bg-base-100 sm:w-80">
										<Search
											aria-hidden="true"
											className="size-4 text-base-content/60"
										/>
										<input
											aria-label="Search communities"
											placeholder="Search communities"
											className="min-w-0 grow"
											value={q}
											onChange={(event) =>
												navigate({
													search: (prev) => ({
														...prev,
														q: event.target.value || undefined,
														page: 1,
													}),
													replace: true,
												})
											}
										/>
									</label>
								</div>
								<CustomTable
									data={rows}
									columns={columns}
									actions={actions}
									caption="Managed communities"
									emptyMessage={
										q
											? "No communities match this search."
											: "No communities are assigned to you yet."
									}
									totalCount={filtered.length}
									paginationProps={{
										page: currentPage,
										pageSize,
										totalPages,
										setPagination: (nextPage, nextSize) =>
											navigate({
												search: (prev) => ({
													...prev,
													page: nextPage,
													pageSize: nextSize ?? prev.pageSize,
												}),
												replace: true,
											}),
									}}
								/>
							</section>
						</div>
					);
				}}
			</PageLoader>
		</div>
	);
}
