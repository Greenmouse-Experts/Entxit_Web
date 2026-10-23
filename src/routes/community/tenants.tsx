import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UsersRound, X } from "lucide-react";
import { useState } from "react";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { demoCommunities } from "@/data/demo.community";
import { type DemoTenant, demoTenants } from "@/data/demo.tenants";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";

type TenantStatus = DemoTenant["status"] | "all";
type TenantsSearch = {
	communityId?: string;
	q?: string;
	status?: TenantStatus;
	page?: number;
	pageSize?: number;
};

export const Route = createFileRoute("/community/tenants")({
	validateSearch: (search: Record<string, unknown>): TenantsSearch => ({
		communityId: textParam(search.communityId),
		q: textParam(search.q),
		status:
			search.status === "active" ||
			search.status === "pending" ||
			search.status === "inactive"
				? search.status
				: "all",
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: TenantsPage,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

const statusClass: Record<DemoTenant["status"], string> = {
	active: "badge-success",
	pending: "badge-warning",
	inactive: "badge-ghost",
};

const columns: columnType<DemoTenant>[] = [
	{
		key: "name",
		label: "Tenant",
		render: (_, tenant) => (
			<div className="flex min-w-52 items-center gap-3">
				<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
					{tenant.name
						.split(" ")
						.map((part) => part[0])
						.slice(0, 2)
						.join("")}
				</span>
				<span className="min-w-0">
					<span className="block font-semibold">{tenant.name}</span>
					<span className="block truncate text-xs text-base-content/65">
						{tenant.email}
					</span>
				</span>
			</div>
		),
	},
	{
		key: "unit",
		label: "Unit",
		render: (_, tenant) => <span className="font-medium">{tenant.unit}</span>,
	},
	{ key: "type", label: "Type" },
	{
		key: "joinedAt",
		label: "Joined",
		render: (_, tenant) =>
			dateFormatter.format(new Date(`${tenant.joinedAt}T00:00:00Z`)),
	},
	{
		key: "status",
		label: "Status",
		render: (_, tenant) => (
			<span
				className={`badge badge-soft badge-sm capitalize ${statusClass[tenant.status]}`}
			>
				{tenant.status}
			</span>
		),
	},
];

function TenantsPage() {
	const navigate = Route.useNavigate();
	const {
		communityId,
		q = "",
		status = "all",
		page = 1,
		pageSize = 10,
	} = Route.useSearch();
	const [previewTenant, setPreviewTenant] = useState<DemoTenant | null>(null);
	const selectedCommunity =
		demoCommunities.find((community) => community.id === communityId) ??
		demoCommunities[0];
	const communityTenants = demoTenants.filter(
		(tenant) => tenant.communityId === selectedCommunity.id,
	);
	const activeCount = communityTenants.filter(
		(tenant) => tenant.status === "active",
	).length;
	const pendingCount = communityTenants.filter(
		(tenant) => tenant.status === "pending",
	).length;
	const normalizedQuery = q.trim().toLowerCase();
	const filtered = communityTenants.filter((tenant) => {
		const matchesStatus = status === "all" || tenant.status === status;
		const matchesQuery =
			!normalizedQuery ||
			[tenant.name, tenant.email, tenant.unit, tenant.type].some((value) =>
				value.toLowerCase().includes(normalizedQuery),
			);
		return matchesStatus && matchesQuery;
	});
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);
	const actions: Actions<DemoTenant>[] = [
		{
			key: "preview",
			label: "View profile",
			action: (tenant) => setPreviewTenant(tenant),
		},
	];

	return (
		<div className="space-y-7">
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="space-y-2">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							Tenants
						</h1>
						<span className="badge badge-outline badge-sm">Demo data</span>
					</div>
					<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
						A sample view of the people and spaces in your community.
					</p>
				</div>
				<label className="flex min-w-52 flex-col gap-1.5 text-xs font-medium text-base-content/70">
					Community
					<select
						className="select select-bordered w-full bg-base-100 text-sm text-base-content"
						value={selectedCommunity.id}
						onChange={(event) =>
							navigate({
								search: (prev) => ({
									...prev,
									communityId: event.target.value,
									page: 1,
								}),
								replace: true,
							})
						}
					>
						{demoCommunities.map((community) => (
							<option key={community.id} value={community.id}>
								{community.name}
							</option>
						))}
					</select>
				</label>
			</div>

			<section
				aria-label="Tenant summary"
				className="grid overflow-hidden rounded-box border border-base-300 bg-base-100 sm:grid-cols-3"
			>
				{[
					{ label: "Total tenants", value: communityTenants.length },
					{ label: "Active", value: activeCount },
					{ label: "Pending", value: pendingCount },
				].map(({ label, value }, index) => (
					<div
						key={label}
						className={`px-6 py-5 ${index > 0 ? "border-t border-base-300 sm:border-l sm:border-t-0" : ""}`}
					>
						<p className="text-sm text-base-content/70">{label}</p>
						<p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
					</div>
				))}
			</section>

			<section aria-label="Tenant directory" className="space-y-4">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold">Tenant directory</h2>
						<p className="mt-1 text-sm text-base-content/70">
							Browse sample records for {selectedCommunity.name}.
						</p>
					</div>
					<div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
						<label className="input input-bordered flex w-full items-center gap-2 bg-base-100 sm:w-64">
							<Search
								aria-hidden="true"
								className="size-4 text-base-content/60"
							/>
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
								placeholder="Search tenants"
								aria-label="Search tenants"
								className="min-w-0 grow"
							/>
						</label>
						<label className="flex items-center gap-2 text-sm text-base-content/70">
							<span className="sr-only">Filter by status</span>
							<select
								aria-label="Filter by status"
								className="select select-bordered bg-base-100"
								value={status}
								onChange={(event) =>
									navigate({
										search: (prev) => ({
											...prev,
											status: event.target.value as TenantStatus,
											page: 1,
										}),
										replace: true,
									})
								}
							>
								<option value="all">All statuses</option>
								<option value="active">Active</option>
								<option value="pending">Pending</option>
								<option value="inactive">Inactive</option>
							</select>
						</label>
					</div>
				</div>
				{(q || status !== "all") && (
					<button
						type="button"
						className="btn btn-ghost btn-sm"
						onClick={() =>
							navigate({
								search: (prev) => ({
									...prev,
									q: undefined,
									status: "all",
									page: 1,
								}),
								replace: true,
							})
						}
					>
						Clear filters
					</button>
				)}
				<CustomTable
					data={rows}
					columns={columns}
					actions={actions}
					caption={`${selectedCommunity.name} tenants`}
					emptyMessage="No sample tenants match these filters."
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

			<Dialog
				open={previewTenant !== null}
				onClose={() => setPreviewTenant(null)}
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-neutral/55" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<DialogPanel className="w-full max-w-md rounded-box bg-base-100 p-6 shadow-xl sm:p-8">
						<div className="flex items-start justify-between gap-4">
							<div>
								<DialogTitle className="text-xl font-semibold">
									Tenant profile
								</DialogTitle>
								<p className="mt-1 text-sm text-base-content/70">
									Sample record
								</p>
							</div>
							<button
								type="button"
								className="btn btn-ghost btn-sm btn-square"
								aria-label="Close profile"
								onClick={() => setPreviewTenant(null)}
							>
								<X aria-hidden="true" className="size-4" />
							</button>
						</div>
						{previewTenant && (
							<div className="mt-6">
								<div className="flex items-center gap-3 border-b border-base-300 pb-5">
									<span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
										<UsersRound aria-hidden="true" className="size-5" />
									</span>
									<div>
										<p className="font-semibold">{previewTenant.name}</p>
										<p className="text-sm text-base-content/70">
											{previewTenant.email}
										</p>
									</div>
								</div>
								<dl className="divide-y divide-base-300">
									{[
										{ label: "Unit", value: previewTenant.unit },
										{ label: "Type", value: previewTenant.type },
										{ label: "Status", value: previewTenant.status },
										{
											label: "Joined",
											value: dateFormatter.format(
												new Date(`${previewTenant.joinedAt}T00:00:00Z`),
											),
										},
									].map(({ label, value }) => (
										<div
											key={label}
											className="flex justify-between gap-4 py-3 text-sm"
										>
											<dt className="text-base-content/65">{label}</dt>
											<dd className="text-right font-medium capitalize">
												{value}
											</dd>
										</div>
									))}
								</dl>
							</div>
						)}
					</DialogPanel>
				</div>
			</Dialog>
		</div>
	);
}
