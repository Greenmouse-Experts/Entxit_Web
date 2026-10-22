import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Search, ShieldCheck, UsersRound } from "lucide-react";
import { useDeferredValue } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/layout/PageLoader";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { adminService } from "@/services/admin.service";
import type { HostCommunitySummary } from "@/services/types";

type CommunitySearch = { page?: number; pageSize?: number; q?: string };

export const Route = createFileRoute("/dashboard/organisations/")({
	validateSearch: (search: Record<string, unknown>): CommunitySearch => ({
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
		q: textParam(search.q),
	}),
	component: CommunitiesPage,
});

function CommunitiesPage() {
	const navigate = Route.useNavigate();
	const { page = 1, pageSize = 10, q = "" } = Route.useSearch();
	const deferredQuery = useDeferredValue(q);
	const queryClient = useQueryClient();
	const communitiesQuery = useQuery({
		queryKey: ["admin", "communities", page, pageSize, deferredQuery],
		queryFn: () =>
			adminService.getCommunities({
				page,
				limit: pageSize,
				search: deferredQuery || undefined,
			}),
	});
	const statsQuery = useQuery({
		queryKey: ["admin", "community-stats"],
		queryFn: adminService.getCommunityStats,
	});
	const changeStatus = useMutation({
		mutationFn: ({
			id,
			action,
		}: {
			id: string;
			action: "enable" | "disable" | "delete";
		}) => {
			if (action === "enable") return adminService.enableCommunity(id);
			if (action === "disable") return adminService.disableCommunity(id);
			return adminService.deleteCommunity(id);
		},
		onSuccess: async (_, variables) => {
			toast.success(
				variables.action === "delete"
					? "Community deleted"
					: variables.action === "enable"
						? "Community enabled"
						: "Community disabled",
			);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["admin", "communities"] }),
				queryClient.invalidateQueries({
					queryKey: ["admin", "community-stats"],
				}),
			]);
		},
		onError: () => toast.error("Could not update the community"),
	});

	function act(
		community: HostCommunitySummary,
		action: "enable" | "disable" | "delete",
	) {
		if (!community.id) return;
		if (
			action === "delete" &&
			!window.confirm(
				`Delete ${community.hostCommunityName}? This cannot be undone.`,
			)
		)
			return;
		changeStatus.mutate({ id: community.id, action });
	}

	const columns: columnType<HostCommunitySummary>[] = [
		{
			key: "hostCommunityName",
			label: "Community",
			render: (_, community) => (
				<>
					<span className="font-semibold">{community.hostCommunityName}</span>
					<span className="block text-xs text-base-content/55">
						{[community.address, community.state].filter(Boolean).join(", ") ||
							"Location unavailable"}
					</span>
				</>
			),
		},
		{
			key: "hostCommunityCategoryName",
			label: "Category",
			render: (_, community) => community.hostCommunityCategoryName || "—",
		},
		{
			key: "totalMembers",
			label: "Members",
			render: (_, community) => (
				<>
					<span className="font-medium tabular-nums">
						{community.totalMembers}
					</span>
					<span className="block text-xs text-base-content/55">
						{community.totalGuards} guards
					</span>
				</>
			),
		},
		{
			key: "subscriptionPlanName",
			label: "Subscription",
			render: (_, community) => community.subscriptionPlanName || "No plan",
		},
		{
			key: "communityStatus",
			label: "Status",
			render: (_, community) => (
				<span
					className={`badge badge-sm ${community.communityStatus === "active" ? "badge-success badge-soft" : "badge-warning badge-soft"}`}
				>
					{community.communityStatus}
				</span>
			),
		},
	];

	const actions: Actions<HostCommunitySummary>[] = [
		{
			key: "hosts",
			label: "Hosts",
			disabled: (community) => !community.id,
			action: (_, navigateTo) =>
				navigateTo({ to: "/dashboard/organisations/hosts" }),
		},
		{
			key: "toggle-status",
			label: "Change status",
			render: (community) =>
				community.communityStatus === "active" ? "Disable" : "Enable",
			disabled: (community) => !community.id,
			disable_event: () => changeStatus.isPending,
			action: (community) =>
				act(
					community,
					community.communityStatus === "active" ? "disable" : "enable",
				),
		},
		{
			key: "delete",
			label: "Delete",
			disabled: (community) => !community.id,
			disable_event: () => changeStatus.isPending,
			action: (community) => act(community, "delete"),
		},
	];

	return (
		<OrganisationShell
			title="Communities"
			description="Monitor host communities, their membership, and account status."
		>
			<QueryCompLayout query={statsQuery}>
				{(stats) => (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{[
							{
								label: "Total communities",
								value: stats.payload?.totalCommunities,
								icon: Building2,
							},
							{
								label: "Active communities",
								value: stats.payload?.activeCommunities,
								icon: ShieldCheck,
							},
							{
								label: "Members",
								value: stats.payload?.totalMembers,
								icon: UsersRound,
							},
							{
								label: "Guards",
								value: stats.payload?.totalGuards,
								icon: ShieldCheck,
							},
						].map(({ label, value, icon: Icon }) => (
							<div
								key={label}
								className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
							>
								<div className="flex items-center justify-between text-sm text-base-content/65">
									<span>{label}</span>
									<Icon aria-hidden="true" className="size-5 text-primary" />
								</div>
								<p className="mt-3 text-3xl font-semibold tabular-nums text-base-content">
									{(value ?? "—").toLocaleString()}
								</p>
							</div>
						))}
					</div>
				)}
			</QueryCompLayout>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="font-semibold">All communities</h2>
					<p className="text-sm text-base-content/60">
						Search and manage registered communities
					</p>
				</div>
				<label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
					<Search aria-hidden="true" className="size-4 text-base-content/50" />
					<input
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
						placeholder="Search communities"
						aria-label="Search communities"
						className="grow"
					/>
				</label>
			</div>
			<PageLoader query={communitiesQuery}>
				{(data) => (
					<CustomTable
						data={data.payload?.data ?? []}
						columns={columns}
						actions={actions}
						caption="Communities"
						totalCount={
							data.payload?.pagination?.total ??
							data.payload?.total ??
							data.payload?.data?.length ??
							0
						}
						emptyMessage="No communities match this search."
						paginationProps={{
							page,
							pageSize,
							totalPages:
								data.payload?.pagination?.pages ?? data.payload?.pages,
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
				)}
			</PageLoader>
		</OrganisationShell>
	);
}
