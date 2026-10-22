import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import { ListFeedback, PageControls } from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/dashboard/organisations/hosts")({
	component: HostsPage,
});

const limit = 10;

function HostsPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search.trim());
	const query = useQuery({
		queryKey: ["admin", "community-hosts", page, deferredSearch],
		queryFn: () => adminService.getCommunityHosts({ page, limit, search: deferredSearch || undefined }),
	});
	const hosts = query.data?.payload?.data ?? [];
	const meta = query.data?.payload;
	const totalPages = meta?.pagination?.pages ?? meta?.pages ?? Math.max(1, Math.ceil((meta?.pagination?.total ?? meta?.total ?? hosts.length) / limit));

	return (
		<OrganisationShell title="Community hosts" description="Review hosts across the communities they belong to.">
			<div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
				<div className="flex flex-wrap items-center justify-between gap-3 p-4">
					<div><h2 className="font-semibold">Hosts</h2><p className="text-sm text-base-content/60">Membership details from the admin API</p></div>
					<label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
						<Search aria-hidden="true" className="size-4 text-base-content/50" />
						<input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search hosts" aria-label="Search hosts" className="grow" />
					</label>
				</div>
				<ListFeedback loading={query.isLoading} error={query.isError} empty={hosts.length === 0}>
					<div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>Host</th><th>Community ID</th><th>Phone</th><th>Joined</th><th>Status</th></tr></thead>
						<tbody>{hosts.map((host) => <tr key={host.id}>
							<td><span className="font-medium">{[host.firstName, host.lastName].filter(Boolean).join(" ") || "Unnamed host"}</span><span className="block text-xs text-base-content/55">{host.email}</span></td>
							<td className="font-mono text-xs">{host.communityId}</td>
							<td>{host.phone || "—"}</td>
							<td>{host.joinedAt ? new Date(host.joinedAt).toLocaleDateString() : "—"}</td>
							<td><span className={`badge badge-sm ${host.status === "active" ? "badge-success badge-soft" : "badge-warning badge-soft"}`}>{host.status}</span></td>
						</tr>)}</tbody>
					</table></div>
				</ListFeedback>
				<PageControls page={page} totalPages={totalPages} onPageChange={setPage} />
			</div>
		</OrganisationShell>
	);
}
