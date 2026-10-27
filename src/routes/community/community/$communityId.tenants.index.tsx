import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, UsersRound, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { useCommunityDetails } from "@/components/community/CommunityDetailsContext";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/lib/api-error";
import { pageSizeParam, positiveInt } from "@/lib/url-search";
import { subadminService } from "@/services/subadmin.service";
import type { KycSubmission } from "@/services/types";

type TenantsSearch = { page?: number; pageSize?: number };

export const Route = createFileRoute(
	"/community/community/$communityId/tenants/",
)({
	validateSearch: (search: Record<string, unknown>): TenantsSearch => ({
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: CommunityTenantsPage,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

function formatDate(value?: string) {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

const columns: columnType<KycSubmission>[] = [
	{
		key: "userName",
		label: "Applicant",
		render: (_, item) => (
			<div className="min-w-44">
				<p className="font-semibold">{item.userName || item.userId}</p>
				<p className="text-xs text-base-content/70">
					{item.userEmail || "Email unavailable"}
				</p>
			</div>
		),
	},
	{
		key: "submittedAt",
		label: "Submitted",
		render: (_, item) => formatDate(item.submittedAt),
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

function CommunityTenantsPage() {
	const community = useCommunityDetails();
	const navigate = Route.useNavigate();
	const { page = 1, pageSize = 10 } = Route.useSearch();
	const queryClient = useQueryClient();
	const [selected, setSelected] = useState<KycSubmission | null>(null);
	const [decision, setDecision] = useState<"accept" | "reject" | null>(null);
	const [rejectionReason, setRejectionReason] = useState("");
	const applicationsQuery = useQuery({
		queryKey: ["subadmin", "kyc", "pending", community.id, page, pageSize],
		queryFn: () =>
			subadminService.getPendingKyc(community.id, { page, limit: pageSize }),
	});
	const review = useMutation({
		mutationFn: ({
			userId,
			action,
			reason,
		}: {
			userId: string;
			action: "accept" | "reject";
			reason?: string;
		}) =>
			action === "accept"
				? subadminService.acceptKyc(community.id, userId)
				: subadminService.rejectKyc(community.id, userId, reason ?? ""),
		onSuccess: async (_, variables) => {
			setSelected(null);
			setDecision(null);
			setRejectionReason("");
			toast.success(
				variables.action === "accept"
					? "Tenant application approved"
					: "Tenant application rejected",
			);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["subadmin", "kyc", "pending", community.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ["subadmin", "communities"],
				}),
			]);
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});
	const actions: Actions<KycSubmission>[] = [
		{
			key: "review",
			label: "Review application",
			action: (item) => setSelected(item),
		},
	];

	function closeReview() {
		if (review.isPending) return;
		setSelected(null);
		setDecision(null);
		setRejectionReason("");
	}

	function submitDecision(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selected || !decision) return;
		const reason = rejectionReason.trim();
		if (decision === "reject" && reason.length < 3) return;
		review.mutate({
			userId: selected.userId,
			action: decision,
			reason: decision === "reject" ? reason : undefined,
		});
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold tracking-tight">Tenants</h2>
					<p className="text-sm text-base-content/70">
						Review applications to join {community.name}.
					</p>
				</div>
				<div className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 px-4 py-3">
					<UsersRound aria-hidden="true" className="size-5 text-primary" />
					<div className="text-right">
						<p className="text-xs text-base-content/70">Community members</p>
						<p className="text-xl font-semibold tabular-nums">
							{community.totalMembers?.toLocaleString() ?? "—"}
						</p>
					</div>
				</div>
			</div>
			<p className="text-sm text-base-content/70">
				Approved tenants are included in the member count. Their individual
				records are not available in this view yet.
			</p>

			<section aria-label="Pending tenant applications" className="space-y-3">
				<div>
					<h3 className="text-lg font-semibold">Pending applications</h3>
					<p className="text-sm text-base-content/70">
						Open an application to inspect its documents before making a
						decision.
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
								emptyMessage="No tenant applications are waiting for review."
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

			<Dialog
				open={selected !== null}
				onClose={closeReview}
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-neutral/55" />
				<div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
					<div className="flex min-h-full items-center justify-center">
						<DialogPanel className="w-full max-w-xl rounded-box bg-base-100 p-6 shadow-xl sm:p-8">
							<div className="flex items-start justify-between gap-4">
								<div>
									<DialogTitle className="text-xl font-semibold">
										{selected?.userName || "Tenant application"}
									</DialogTitle>
									<p className="mt-1 text-sm text-base-content/70">
										{selected?.userEmail || "Email unavailable"}
									</p>
								</div>
								<button
									type="button"
									className="btn btn-ghost btn-sm btn-square"
									aria-label="Close application"
									onClick={closeReview}
									disabled={review.isPending}
								>
									<X aria-hidden="true" className="size-4" />
								</button>
							</div>
							{selected && (
								<>
									<dl className="mt-6 divide-y divide-base-300 border-y border-base-300 text-sm">
										<div className="flex justify-between gap-4 py-3">
											<dt className="text-base-content/70">Submitted</dt>
											<dd className="font-medium">
												{formatDate(selected.submittedAt)}
											</dd>
										</div>
										<div className="flex justify-between gap-4 py-3">
											<dt className="text-base-content/70">Documents</dt>
											<dd className="font-medium">
												{selected.documents?.length ?? 0}
											</dd>
										</div>
									</dl>
									{selected.documents?.length ? (
										<ul className="mt-4 divide-y divide-base-300">
											{selected.documents.map((document, index) => (
												<li
													key={`${document.url}-${index}`}
													className="flex items-center gap-3 py-3"
												>
													<FileText
														aria-hidden="true"
														className="size-5 text-primary"
													/>
													<span className="min-w-0 flex-1 truncate text-sm font-medium">
														{document.type || "Document"}
													</span>
													<a
														href={document.url}
														target="_blank"
														rel="noreferrer"
														className="btn btn-outline btn-sm"
													>
														View
													</a>
												</li>
											))}
										</ul>
									) : (
										<p className="mt-4 text-sm text-base-content/70">
											No documents were provided with this application.
										</p>
									)}
									<form
										onSubmit={submitDecision}
										className="mt-6 space-y-4 border-t border-base-300 pt-5"
									>
										<p className="text-sm text-base-content/70">
											Approving adds this person to the community. Rejection
											requires a reason.
										</p>
										{decision === "reject" && (
											<label className="block space-y-2 text-sm font-medium">
												Reason for rejection
												<textarea
													className="textarea textarea-bordered min-h-24 w-full"
													value={rejectionReason}
													onChange={(event) =>
														setRejectionReason(event.target.value)
													}
													minLength={3}
													maxLength={500}
													required
													disabled={review.isPending}
												/>
											</label>
										)}
										<div className="flex flex-wrap justify-end gap-2">
											<button
												type="button"
												className="btn btn-ghost"
												onClick={closeReview}
												disabled={review.isPending}
											>
												Cancel
											</button>
											{decision === null ? (
												<>
													<button
														type="button"
														className="btn btn-outline btn-error"
														onClick={() => setDecision("reject")}
													>
														Reject
													</button>
													<button
														type="button"
														className="btn btn-primary"
														onClick={() => setDecision("accept")}
													>
														Approve
													</button>
												</>
											) : (
												<>
													<button
														type="button"
														className="btn btn-ghost"
														onClick={() => setDecision(null)}
														disabled={review.isPending}
													>
														Back
													</button>
													<button
														type="submit"
														className={`btn ${decision === "accept" ? "btn-primary" : "btn-error"}`}
														disabled={
															review.isPending ||
															(decision === "reject" &&
																rejectionReason.trim().length < 3)
														}
													>
														{review.isPending ? (
															<span className="loading loading-spinner loading-sm" />
														) : decision === "accept" ? (
															"Confirm approval"
														) : (
															"Confirm rejection"
														)}
													</button>
												</>
											)}
										</div>
									</form>
								</>
							)}
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
