import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { useId } from "react";
import { CommunityPicker } from "@/components/community/CommunityPicker";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { subadminService } from "@/services/subadmin.service";
import type { KycSubmission, SubadminCommunity } from "@/services/types";

type TenantsSearch = {
	communityId?: string;
	page?: number;
	pageSize?: number;
};

export const Route = createFileRoute("/community/tenants")({
	validateSearch: (search: Record<string, unknown>): TenantsSearch => ({
		communityId: textParam(search.communityId),
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: TenantsPage,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

function TenantsPage() {
	const navigate = Route.useNavigate();
	const { communityId, page = 1, pageSize = 10 } = Route.useSearch();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<PageLoader
			query={communitiesQuery}
			loadingText="Loading your communities..."
			emptyState={{
				title: "No communities yet",
				description:
					"Tenant information will appear once a community is assigned to you.",
			}}
		>
			{(response) => {
				const communities = response.payload.data;
				const selected =
					communities.find((community) => community.id === communityId) ??
					communities[0];
				if (!selected) return null;
				return (
					<TenantApplications
						community={selected}
						communities={communities}
						page={page}
						pageSize={pageSize}
						onSelect={(id) =>
							navigate({
								search: { communityId: id, page: 1, pageSize },
								replace: true,
							})
						}
					/>
				);
			}}
		</PageLoader>
	);
}

function TenantApplications({
	community,
	communities,
	page,
	pageSize,
	onSelect,
}: {
	community: SubadminCommunity;
	communities: SubadminCommunity[];
	page: number;
	pageSize: number;
	onSelect: (id: string) => void;
}) {
	const navigate = Route.useNavigate();
	const applicationsHeadingId = useId();
	const applicationsQuery = useQuery({
		queryKey: ["subadmin", "kyc", "pending", community.id, page, pageSize],
		queryFn: () =>
			subadminService.getPendingKyc(community.id, { page, limit: pageSize }),
	});
	const columns: columnType<KycSubmission>[] = [
		{
			key: "userName",
			label: "Applicant",
			render: (_, item) => (
				<div>
					<p className="font-semibold">{item.userName || item.userId}</p>
					<p className="text-xs text-base-content/65">
						{item.userEmail || "Email unavailable"}
					</p>
				</div>
			),
		},
		{
			key: "submittedAt",
			label: "Submitted",
			render: (_, item) =>
				item.submittedAt
					? dateFormatter.format(new Date(item.submittedAt))
					: "—",
		},
		{
			key: "documents",
			label: "Documents",
			render: (_, item) => item.documents?.length ?? 0,
		},
		{
			key: "status",
			label: "Status",
			render: (_, item) => (
				<span className="badge badge-warning badge-soft badge-sm capitalize">
					{item.status}
				</span>
			),
		},
	];
	const actions: Actions<KycSubmission>[] = [
		{
			key: "review",
			label: "Review application",
			action: (item, nav) =>
				nav({
					to: "/community/tenants/$userId",
					params: { userId: item.userId },
					search: { communityId: community.id, page, pageSize },
				}),
		},
	];

	return (
		<div className="space-y-7">
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						Tenants
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
						Review people requesting access to {community.name}.
					</p>
				</div>
				<CommunityPicker
					communities={communities}
					selectedId={community.id}
					onSelect={onSelect}
				/>
			</div>
			<section
				aria-label="Tenant summary"
				className="grid overflow-hidden rounded-box border border-base-300 bg-base-100 sm:grid-cols-2"
			>
				<div className="flex items-start justify-between gap-4 p-6">
					<div>
						<p className="text-sm text-base-content/70">Community members</p>
						<p className="mt-2 text-3xl font-semibold tabular-nums">
							{community.totalMembers?.toLocaleString() ?? "—"}
						</p>
					</div>
					<UsersRound aria-hidden="true" className="size-5 text-primary" />
				</div>
				<div className="border-t border-base-300 p-6 sm:border-l sm:border-t-0">
					<p className="text-sm text-base-content/70">Pending applications</p>
					<p className="mt-2 text-3xl font-semibold tabular-nums">
						{applicationsQuery.data?.payload?.pagination?.total ??
							applicationsQuery.data?.payload?.total ??
							"—"}
					</p>
				</div>
			</section>
			<section aria-labelledby={applicationsHeadingId} className="space-y-4">
				<div>
					<h2 id={applicationsHeadingId} className="text-xl font-semibold">
						Pending applications
					</h2>
					<p className="mt-1 text-sm text-base-content/70">
						Review identity documents before adding a person to this community.
					</p>
				</div>
				<PageLoader
					query={applicationsQuery}
					loadingText="Loading applications..."
				>
					{(response) => {
						const payload = response.payload;
						const rows = payload?.data ?? [];
						return (
							<CustomTable
								data={rows}
								columns={columns}
								actions={actions}
								caption={`${community.name} pending tenant applications`}
								emptyMessage="No applications are waiting for review."
								totalCount={
									payload?.pagination?.total ?? payload?.total ?? rows.length
								}
								paginationProps={{
									page,
									pageSize,
									totalPages: payload?.pagination?.pages ?? payload?.pages,
									setPagination: (nextPage, nextSize) =>
										navigate({
											search: {
												communityId: community.id,
												page: nextPage,
												pageSize: nextSize ?? pageSize,
											},
											replace: true,
										}),
								}}
							/>
						);
					}}
				</PageLoader>
			</section>
		</div>
	);
}
