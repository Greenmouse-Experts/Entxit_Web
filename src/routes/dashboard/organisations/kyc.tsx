import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
	ListFeedback,
	PageControls,
} from "@/components/organisations/ListFeedback";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";
import type { KycSubmission } from "@/services/types";

export const Route = createFileRoute("/dashboard/organisations/kyc")({
	component: KycPage,
});

const limit = 10;

function KycPage() {
	const reasonId = useId();
	const rejectTitleId = useId();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [status, setStatus] = useState("pending");
	const [communityId, setCommunityId] = useState("");
	const [selected, setSelected] = useState<KycSubmission | null>(null);
	const [reason, setReason] = useState("");
	const query = useQuery({
		queryKey: ["admin", "kyc", page, status, communityId],
		queryFn: () =>
			adminService.getKycSubmissions({
				page,
				limit,
				status: status === "all" ? undefined : status,
				communityId: communityId.trim() || undefined,
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
	const totalPages =
		meta?.pagination?.pages ??
		meta?.pages ??
		Math.max(
			1,
			Math.ceil(
				(meta?.pagination?.total ?? meta?.total ?? submissions.length) / limit,
			),
		);

	return (
		<OrganisationShell
			title="KYC reviews"
			description="Review identity submissions before hosts join a community."
		>
			<div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
				<div className="flex flex-wrap gap-3 p-4">
					<label className="form-control">
						<span className="mb-1 block text-xs font-medium">Status</span>
						<select
							className="select select-bordered"
							value={status}
							onChange={(event) => {
								setStatus(event.target.value);
								setPage(1);
							}}
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
							onChange={(event) => {
								setCommunityId(event.target.value);
								setPage(1);
							}}
							placeholder="All communities"
						/>
					</label>
				</div>
				<ListFeedback
					loading={query.isLoading}
					error={query.isError}
					empty={submissions.length === 0}
				>
					<div className="overflow-x-auto">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th>Applicant</th>
									<th>Community</th>
									<th>Submitted</th>
									<th>Documents</th>
									<th>Status</th>
									<th className="text-right">Review</th>
								</tr>
							</thead>
							<tbody>
								{submissions.map((submission) => (
									<tr key={submission.id}>
										<td>
											<span className="font-medium">
												{submission.userName || submission.userId}
											</span>
											<span className="block text-xs text-base-content/55">
												{submission.userEmail}
											</span>
										</td>
										<td>
											{submission.communityName || submission.communityId}
										</td>
										<td>
											{submission.submittedAt
												? new Date(submission.submittedAt).toLocaleDateString()
												: "—"}
										</td>
										<td>
											{submission.documents?.length ? (
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
											)}
										</td>
										<td>
											<span
												className={`badge badge-sm ${submission.status === "approved" ? "badge-success badge-soft" : submission.status === "rejected" ? "badge-error badge-soft" : "badge-warning badge-soft"}`}
											>
												{submission.status}
											</span>
										</td>
										<td>
											<div className="flex justify-end gap-2">
												<button
													type="button"
													className="btn btn-success btn-outline btn-xs"
													disabled={
														review.isPending || submission.status !== "pending"
													}
													onClick={() => {
														if (
															window.confirm(
																`Approve ${submission.userName || submission.userId}?`,
															)
														)
															review.mutate({
																submission,
																decision: "approve",
															});
													}}
												>
													Approve
												</button>
												<button
													type="button"
													className="btn btn-error btn-outline btn-xs"
													disabled={
														review.isPending || submission.status !== "pending"
													}
													onClick={() => setSelected(submission)}
												>
													Reject
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</ListFeedback>
				<PageControls
					page={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>
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
