import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { ListFeedback } from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { adminService } from "@/services/admin.service";
import { alertsService } from "@/services/alerts.service";
import type { SecurityAlert } from "@/services/types";

type AlertsSearch = { page?: number; pageSize?: number; communityId?: string };

export const Route = createFileRoute("/dashboard/organisations/alerts")({
	validateSearch: (search: Record<string, unknown>): AlertsSearch => ({
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
		communityId: textParam(search.communityId),
	}),
	component: SecurityAlertsPage,
});

function SecurityAlertsPage() {
	const navigate = Route.useNavigate();
	const { page = 1, pageSize = 10, communityId = "" } = Route.useSearch();
	const communityInputId = useId();
	const queryClient = useQueryClient();
	const communitiesQuery = useQuery({
		queryKey: ["admin", "alert-community-options"],
		queryFn: () => adminService.getCommunities({ page: 1, limit: 100 }),
	});
	const alertsQuery = useQuery({
		queryKey: ["admin", "security-alerts", communityId, page, pageSize],
		queryFn: () =>
			alertsService.getSecurityAlerts(communityId, { page, limit: pageSize }),
		enabled: Boolean(communityId),
	});
	const markRead = useMutation({
		mutationFn: alertsService.markSecurityAlertAsRead,
		onSuccess: async () => {
			toast.success("Alert marked as read");
			await queryClient.invalidateQueries({
				queryKey: ["admin", "security-alerts"],
			});
		},
		onError: () => toast.error("Could not update the alert"),
	});
	const alerts = alertsQuery.data?.payload?.data ?? [];
	const meta = alertsQuery.data?.payload;
	const totalCount = meta?.pagination?.total ?? meta?.total ?? alerts.length;
	const totalPages =
		meta?.pagination?.pages ??
		meta?.pages ??
		Math.max(1, Math.ceil(totalCount / pageSize));
	const columns: columnType<SecurityAlert>[] = [
		{
			key: "title",
			label: "Alert",
			render: (_, alert) => (
				<>
					<span className="font-semibold">{alert.title}</span>
					<span className="block max-w-md text-xs text-base-content/65">
						{alert.content}
					</span>
				</>
			),
		},
		{
			key: "severity",
			label: "Severity",
			render: (_, alert) => (
				<span
					className={`badge badge-sm ${alert.severity === "critical" || alert.severity === "high" ? "badge-error badge-soft" : "badge-warning badge-soft"}`}
				>
					{alert.severity || "Alert"}
				</span>
			),
		},
		{
			key: "securityName",
			label: "Reported by",
			render: (_, alert) => alert.securityName || "Security team",
		},
		{
			key: "createdAt",
			label: "Reported",
			render: (_, alert) => new Date(alert.createdAt).toLocaleString(),
		},
		{
			key: "isRead",
			label: "Status",
			render: (_, alert) => (
				<span
					className={`badge badge-sm ${alert.isRead ? "badge-neutral badge-soft" : "badge-primary badge-soft"}`}
				>
					{alert.isRead ? "Read" : "Unread"}
				</span>
			),
		},
		{
			key: "action",
			label: "Action",
			className: "text-right",
			render: (_, alert) =>
				!alert.isRead && (
					<button
						type="button"
						className="btn btn-outline btn-xs"
						disabled={markRead.isPending}
						onClick={() => markRead.mutate(alert.id)}
					>
						Mark read
					</button>
				),
		},
	];

	return (
		<OrganisationShell
			title="Security alerts"
			description="Review security alerts for a selected community."
		>
			<div>
				<label
					htmlFor={communityInputId}
					className="mb-1 block text-sm font-medium"
				>
					Community
				</label>
				<select
					id={communityInputId}
					className="select select-bordered w-full max-w-sm"
					value={communityId}
					onChange={(event) =>
						navigate({
							search: (prev) => ({
								...prev,
								communityId: event.target.value || undefined,
								page: 1,
							}),
							replace: true,
						})
					}
				>
					<option value="">Select a community</option>
					{communitiesQuery.data?.payload?.data?.map(
						(community) =>
							community.id && (
								<option key={community.id} value={community.id}>
									{community.hostCommunityName}
								</option>
							),
					)}
				</select>
				{communitiesQuery.isError && (
					<p role="alert" className="mt-2 text-sm text-error">
						Could not load communities.
					</p>
				)}
			</div>
			{communityId ? (
				<ListFeedback
					loading={alertsQuery.isLoading}
					error={alertsQuery.isError}
					empty={false}
				>
					<CustomTable
						data={alerts}
						columns={columns}
						caption="Security alerts"
						totalCount={totalCount}
						emptyMessage="No security alerts for this community."
						paginationProps={{
							page,
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
				</ListFeedback>
			) : (
				<div className="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center text-sm text-base-content/60">
					Choose a community to load its security alerts.
				</div>
			)}
		</OrganisationShell>
	);
}
