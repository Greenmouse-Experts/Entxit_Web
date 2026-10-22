import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useId, useState } from "react";
import { toast } from "sonner";
import { ListFeedback } from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { adminService } from "@/services/admin.service";
import type { KycSubmission } from "@/services/types";

type KycStatus = "pending" | "approved" | "rejected" | "all";
type KycSearch = {
	page?: number;
	pageSize?: number;
	status?: KycStatus;
	communityId?: string;
};
const statuses: KycStatus[] = ["pending", "approved", "rejected", "all"];

export const Route = createFileRoute("/dashboard/organisations/kyc")({
	validateSearch: (search: Record<string, unknown>): KycSearch => ({
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
		status: statuses.includes(search.status as KycStatus)
			? (search.status as KycStatus)
			: "pending",
		communityId: textParam(search.communityId),
	}),
	component: KycPage,
});

function KycPage() {
	const navigate = Route.useNavigate();
	const {
		page = 1,
		pageSize = 10,
		status = "pending",
		communityId = "",
	} = Route.useSearch();
	const deferredCommunityId = useDeferredValue(communityId);
	const reasonId = useId();
	const rejectTitleId = useId();
	const queryClient = useQueryClient();
	const [selected, setSelected] = useState<KycSubmission | null>(null);
	const [reason, setReason] = useState("");
	const query = useQuery({
		queryKey: ["admin", "kyc", page, pageSize, status, deferredCommunityId],
		queryFn: () =>
			adminService.getKycSubmissions({
				page,
				limit: pageSize,
				status: status === "all" ? undefined : status,
				communityId: deferredCommunityId || undefined,
			}),
	});
	const review = useMutation({
		mutationFn: ({
			submission,
			decision,
			reason: rejectionReason,
		}: {
			submission: KycSubmission;
			decision: "approve" | "reject";
			reason?: string;
		}) =>
			decision === "approve"
				? adminService.approveKyc(submission.userId, submission.communityId)
				: adminService.rejectKyc(submission.userId, submission.communityId, {
						reason: rejectionReason ?? "",
					}),
		onSuccess: async (_, variables) => {
			toast.success(
				variables.decision === "approve"
					? "Submission approved"
					: "Submission rejected",
			);
			setSelected(null);
			setReason("");
			await queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
		},
		onError: () => toast.error("Could not review this submission"),
	});
	const submissions = query.data?.payload?.data ?? [];
	const meta = query.data?.payload;
	const totalCount =
		meta?.pagination?.total ?? meta?.total ?? submissions.length;
	const totalPages =
		meta?.pagination?.pages ??
		meta?.pages ??
		Math.max(1, Math.ceil(totalCount / pageSize));
	const columns: columnType<KycSubmission>[] = [
		{
			key: "userName",
			label: "Applicant",
			render: (_, submission) => (
				<>
					<span className="font-semibold">
						{submission.userName || submission.userId}
					</span>
					<span className="block text-xs text-base-content/55">
						{submission.userEmail}
					</span>
				</>
			),
		},
		{
			key: "communityName",
			label: "Community",
			render: (_, submission) =>
				submission.communityName || submission.communityId,
		},
		{
			key: "submittedAt",
			label: "Submitted",
			render: (_, submission) =>
				submission.submittedAt
					? new Date(submission.submittedAt).toLocaleDateString()
					: "—",
		},
		{
			key: "documents",
			label: "Documents",
			render: (_, submission) =>
				submission.documents?.length ? (
					<div className="flex flex-wrap gap-2">
						{submission.documents.map((document) => (
							<a
								key={`${document.type}-${document.url}`}
								className="link link-primary text-xs"
								href={document.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								{document.type}
							</a>
						))}
					</div>
				) : (
					"—"
				),
		},
		{
			key: "status",
			label: "Status",
			render: (_, submission) => (
				<span
					className={`badge badge-sm ${submission.status === "approved" ? "badge-success badge-soft" : submission.status === "rejected" ? "badge-error badge-soft" : "badge-warning badge-soft"}`}
				>
					{submission.status}
				</span>
			),
		},
		{
			key: "action",
			label: "Review",
			className: "text-right",
			render: (_, submission) => (
				<div className="flex justify-end gap-2">
					<button
						type="button"
						className="btn btn-success btn-outline btn-xs"
						disabled={review.isPending || submission.status !== "pending"}
						onClick={() => {
							if (
								window.confirm(
									`Approve ${submission.userName || submission.userId}?`,
								)
							)
								review.mutate({ submission, decision: "approve" });
						}}
					>
						Approve
					</button>
					<button
						type="button"
						className="btn btn-error btn-outline btn-xs"
						disabled={review.isPending || submission.status !== "pending"}
						onClick={() => setSelected(submission)}
					>
						Reject
					</button>
				</div>
			),
		},
	];

	return (
		<OrganisationShell
			title="KYC reviews"
			description="Review identity submissions before hosts join a community."
		>
			<div className="flex flex-wrap gap-3">
				<label className="form-control">
					<span className="mb-1 block text-xs font-medium">Status</span>
					<select
						className="select select-bordered"
						value={status}
						onChange={(event) =>
							navigate({
								search: (prev) => ({
									...prev,
									status: event.target.value as KycStatus,
									page: 1,
								}),
								replace: true,
							})
						}
					>
						<option value="pending">Pending</option>
						<option value="approved">Approved</option>
						<option value="rejected">Rejected</option>
						<option value="all">All statuses</option>
					</select>
				</label>
				<label className="form-control">
					<span className="mb-1 block text-xs font-medium">Community ID</span>
					<input
						className="input input-bordered"
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
						placeholder="All communities"
					/>
				</label>
			</div>
			<ListFeedback
				loading={query.isLoading}
				error={query.isError}
				empty={false}
			>
				<CustomTable
					data={submissions}
					columns={columns}
					caption="KYC submissions"
					totalCount={totalCount}
					emptyMessage="No KYC submissions match these filters."
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
			{selected && (
				<div className="modal modal-open" role="presentation">
					<div
						className="modal-box"
						role="dialog"
						aria-modal="true"
						aria-labelledby={rejectTitleId}
					>
						<h2 id={rejectTitleId} className="text-lg font-semibold">
							Reject KYC submission
						</h2>
						<p className="mt-1 text-sm text-base-content/60">
							Give the applicant a clear reason for the rejection.
						</p>
						<label
							className="mt-4 block text-sm font-medium"
							htmlFor={reasonId}
						>
							Reason
						</label>
						<textarea
							id={reasonId}
							className="textarea textarea-bordered mt-2 w-full"
							rows={4}
							value={reason}
							onChange={(event) => setReason(event.target.value)}
						/>
						<div className="modal-action">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={() => {
									setSelected(null);
									setReason("");
								}}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-error"
								disabled={!reason.trim() || review.isPending}
								onClick={() =>
									review.mutate({
										submission: selected,
										decision: "reject",
										reason: reason.trim(),
									})
								}
							>
								Reject submission
							</button>
						</div>
					</div>
					<button
						type="button"
						className="modal-backdrop"
						aria-label="Close dialog"
						onClick={() => setSelected(null)}
					/>
				</div>
			)}
		</OrganisationShell>
	);
}
