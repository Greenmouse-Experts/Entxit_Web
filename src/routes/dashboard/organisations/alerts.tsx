import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ListFeedback, PageControls } from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";
import { alertsService } from "@/services/alerts.service";

export const Route = createFileRoute("/dashboard/organisations/alerts")({ component: SecurityAlertsPage });

const limit = 10;

function SecurityAlertsPage() {
	const queryClient = useQueryClient();
	const [communityId, setCommunityId] = useState("");
	const [page, setPage] = useState(1);
	const communitiesQuery = useQuery({ queryKey: ["admin", "alert-community-options"], queryFn: () => adminService.getCommunities({ page: 1, limit: 100 }) });
	const alertsQuery = useQuery({
		queryKey: ["admin", "security-alerts", communityId, page],
		queryFn: () => alertsService.getSecurityAlerts(communityId, { page, limit }),
		enabled: Boolean(communityId),
	});
	const markRead = useMutation({
		mutationFn: alertsService.markSecurityAlertAsRead,
		onSuccess: async () => { toast.success("Alert marked as read"); await queryClient.invalidateQueries({ queryKey: ["admin", "security-alerts"] }); },
		onError: () => toast.error("Could not update the alert"),
	});
	const alerts = alertsQuery.data?.payload?.data ?? [];
	const meta = alertsQuery.data?.payload;
	const totalPages = meta?.pagination?.pages ?? meta?.pages ?? Math.max(1, Math.ceil((meta?.pagination?.total ?? meta?.total ?? alerts.length) / limit));

	return <OrganisationShell title="Security alerts" description="Review security alerts for a selected community.">
		<div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
			<div className="p-4"><label htmlFor="alert-community" className="mb-1 block text-sm font-medium">Community</label>
				<select id="alert-community" className="select select-bordered w-full max-w-sm" value={communityId} onChange={(event) => { setCommunityId(event.target.value); setPage(1); }}>
					<option value="">Select a community</option>
					{communitiesQuery.data?.payload?.data?.map((community) => community.id && <option key={community.id} value={community.id}>{community.hostCommunityName}</option>)}
				</select>
				{communitiesQuery.isError && <p role="alert" className="mt-2 text-sm text-error">Could not load communities.</p>}
			</div>
			{communityId ? <ListFeedback loading={alertsQuery.isLoading} error={alertsQuery.isError} empty={alerts.length === 0}>
				<div className="divide-y divide-base-200">{alerts.map((alert) => <article key={alert.id} className="flex flex-wrap items-start justify-between gap-4 p-4">
					<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{alert.title}</h2><span className={`badge badge-sm ${alert.severity === "critical" || alert.severity === "high" ? "badge-error badge-soft" : "badge-warning badge-soft"}`}>{alert.severity || "Alert"}</span>{!alert.isRead && <span className="badge badge-primary badge-soft badge-sm">Unread</span>}</div><p className="mt-1 text-sm text-base-content/75">{alert.content}</p><p className="mt-2 text-xs text-base-content/55">{alert.securityName || "Security team"} · {new Date(alert.createdAt).toLocaleString()}</p></div>
					{!alert.isRead && <button type="button" className="btn btn-outline btn-sm" disabled={markRead.isPending} onClick={() => markRead.mutate(alert.id)}>Mark read</button>}
				</article>)}</div>
			</ListFeedback> : <p className="px-4 pb-6 text-sm text-base-content/60">Choose a community to load its security alerts.</p>}
			<PageControls page={page} totalPages={totalPages} onPageChange={setPage} />
		</div>
	</OrganisationShell>;
}
