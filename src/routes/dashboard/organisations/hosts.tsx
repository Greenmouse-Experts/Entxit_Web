import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useDeferredValue } from "react";
import PageLoader from "@/components/layout/PageLoader";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { adminService } from "@/services/admin.service";
import type { HostCommunityHost } from "@/services/types";

type HostsSearch = { page?: number; pageSize?: number; q?: string };

export const Route = createFileRoute("/dashboard/organisations/hosts")({
	validateSearch: (search: Record<string, unknown>): HostsSearch => ({
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
		q: textParam(search.q),
	}),
	component: HostsPage,
});

function HostsPage() {
	const navigate = Route.useNavigate();
	const { page = 1, pageSize = 10, q = "" } = Route.useSearch();
	const deferredQuery = useDeferredValue(q);
	const query = useQuery({
		queryKey: ["admin", "community-hosts", page, pageSize, deferredQuery],
		queryFn: () =>
			adminService.getCommunityHosts({
				page,
				limit: pageSize,
				search: deferredQuery || undefined,
			}),
	});
	const columns: columnType<HostCommunityHost>[] = [
		{
			key: "firstName",
			label: "Host",
			render: (_, host) => (
				<>
					<span className="font-semibold">
						{[host.firstName, host.lastName].filter(Boolean).join(" ") ||
							"Unnamed host"}
					</span>
					<span className="block text-xs text-base-content/55">
						{host.email}
					</span>
				</>
			),
		},
		{
			key: "communityId",
			label: "Community ID",
			render: (_, host) => (
				<span className="font-mono text-xs">{host.communityId}</span>
			),
		},
		{ key: "phone", label: "Phone", render: (_, host) => host.phone || "—" },
		{
			key: "joinedAt",
			label: "Joined",
			render: (_, host) =>
				host.joinedAt ? new Date(host.joinedAt).toLocaleDateString() : "—",
		},
		{
			key: "status",
			label: "Status",
			render: (_, host) => (
				<span
					className={`badge badge-sm ${host.status === "active" ? "badge-success badge-soft" : "badge-warning badge-soft"}`}
				>
					{host.status}
				</span>
			),
		},
	];

	return (
		<OrganisationShell
			title="Community hosts"
			description="Review hosts across the communities they belong to."
		>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="font-semibold">Hosts</h2>
					<p className="text-sm text-base-content/60">
						Membership details from the admin API
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
						placeholder="Search hosts"
						aria-label="Search hosts"
						className="grow"
					/>
				</label>
			</div>
			<PageLoader query={query}>
				{(data) => (
					<CustomTable
						data={data.payload?.data ?? []}
						columns={columns}
						caption="Community hosts"
						totalCount={
							data.payload?.pagination?.total ??
							data.payload?.total ??
							data.payload?.data?.length ??
							0
						}
						emptyMessage="No hosts match this search."
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
