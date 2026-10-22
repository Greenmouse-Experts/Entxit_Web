import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Search, ShieldCheck, UsersRound } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { toast } from "sonner";
import { ListFeedback, PageControls } from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";
import type { HostCommunitySummary } from "@/services/types";

export const Route = createFileRoute("/dashboard/organisations/")({
	component: CommunitiesPage,
});

const limit = 10;

function CommunitiesPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search.trim());
	const communitiesQuery = useQuery({
		queryKey: ["admin", "communities", page, deferredSearch],
		queryFn: () => adminService.getCommunities({ page, limit, search: deferredSearch || undefined }),
	});
	const statsQuery = useQuery({ queryKey: ["admin", "community-stats"], queryFn: adminService.getCommunityStats });
	const changeStatus = useMutation({
		mutationFn: async ({ id, action }: { id: string; action: "enable" | "disable" | "delete" }) => {
			if (action === "enable") return adminService.enableCommunity(id);
			if (action === "disable") return adminService.disableCommunity(id);
			return adminService.deleteCommunity(id);
		},
		onSuccess: async (_, variables) => {
			toast.success(variables.action === "delete" ? "Community deleted" : variables.action === "enable" ? "Community enabled" : "Community disabled");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["admin", "communities"] }),
				queryClient.invalidateQueries({ queryKey: ["admin", "community-stats"] }),
			]);
		},
		onError: () => toast.error("Could not update the community"),
	});
	const rows = communitiesQuery.data?.payload?.data ?? [];
	const meta = communitiesQuery.data?.payload;
	const totalPages = meta?.pagination?.pages ?? meta?.pages ?? Math.max(1, Math.ceil((meta?.pagination?.total ?? meta?.total ?? rows.length) / limit));
	const stats = statsQuery.data?.payload;

	function act(community: HostCommunitySummary, action: "enable" | "disable" | "delete") {
		if (!community.id) return;
		if (action === "delete" && !window.confirm(`Delete ${community.hostCommunityName}? This cannot be undone.`)) return;
		changeStatus.mutate({ id: community.id, action });
	}

	return (
		<OrganisationShell title="Communities" description="Monitor host communities, their membership, and account status.">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{[
					{ label: "Total communities", value: stats?.totalCommunities, icon: Building2 },
					{ label: "Active communities", value: stats?.activeCommunities, icon: ShieldCheck },
					{ label: "Members", value: stats?.totalMembers, icon: UsersRound },
					{ label: "Guards", value: stats?.totalGuards, icon: ShieldCheck },
				].map(({ label, value, icon: Icon }) => (
					<div key={label} className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
						<div className="flex items-center justify-between text-sm text-base-content/65"><span>{label}</span><Icon aria-hidden="true" className="size-5 text-primary" /></div>
						<p className="mt-3 text-3xl font-semibold tabular-nums text-base-content">{statsQuery.isLoading ? "…" : (value ?? "—").toLocaleString()}</p>
					</div>
				))}
			</div>
			<div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 p-4">
					<div><h2 className="font-semibold">All communities</h2><p className="text-sm text-base-content/60">Search and manage registered communities</p></div>
					<label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
						<Search aria-hidden="true" className="size-4 text-base-content/50" />
						<input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search communities" aria-label="Search communities" className="grow" />
					</label>
				</div>
				<ListFeedback loading={communitiesQuery.isLoading} error={communitiesQuery.isError} empty={rows.length === 0}>
					<div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>Community</th><th>Category</th><th>Members</th><th>Subscription</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
						<tbody>{rows.map((community) => <tr key={community.id ?? community.hostCommunityName}>
							<td><span className="font-medium">{community.hostCommunityName}</span><span className="block text-xs text-base-content/55">{[community.address, community.state].filter(Boolean).join(", ") || "Location unavailable"}</span></td>
							<td>{community.hostCommunityCategoryName || "—"}</td>
							<td>{community.totalMembers} <span className="text-xs text-base-content/55">· {community.totalGuards} guards</span></td>
							<td>{community.subscriptionPlanName || "No plan"}</td>
							<td><span className={`badge badge-sm ${community.communityStatus === "active" ? "badge-success badge-soft" : "badge-warning badge-soft"}`}>{community.communityStatus}</span></td>
							<td><div className="flex justify-end gap-2">
								{community.id && <Link className="btn btn-ghost btn-xs" to="/dashboard/organisations/hosts">Hosts</Link>}
								<button type="button" className="btn btn-outline btn-xs" disabled={!community.id || changeStatus.isPending} onClick={() => act(community, community.communityStatus === "active" ? "disable" : "enable")}>{community.communityStatus === "active" ? "Disable" : "Enable"}</button>
								<button type="button" className="btn btn-ghost btn-xs text-error" disabled={!community.id || changeStatus.isPending} onClick={() => act(community, "delete")}>Delete</button>
							</div></td>
						</tr>)}</tbody>
					</table></div>
				</ListFeedback>
				<PageControls page={page} totalPages={totalPages} onPageChange={setPage} />
			</div>
		</OrganisationShell>
	);
}
