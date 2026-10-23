import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, UserRound } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/lib/api-error";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { subadminService } from "@/services/subadmin.service";
import type { KycSubmission, SubadminCommunity } from "@/services/types";

type ReviewSearch = { communityId?: string; page?: number; pageSize?: number };

export const Route = createFileRoute("/community/tenants/$userId")({
	validateSearch: (search: Record<string, unknown>): ReviewSearch => ({
		communityId: textParam(search.communityId),
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: TenantReviewPage,
});

function TenantReviewPage() {
	const { userId } = Route.useParams();
	const { communityId, page = 1, pageSize = 10 } = Route.useSearch();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<PageLoader
			query={communitiesQuery}
			loadingText="Loading your communities..."
		>
			{(response) => {
				const communities = response.payload.data;
				const community =
					communities.find((item) => item.id === communityId) ?? communities[0];
				if (!community)
					return (
						<p className="text-sm text-base-content/70">
							No community is assigned to your account.
						</p>
					);
				return (
					<ReviewApplication
						community={community}
						userId={userId}
						page={page}
						pageSize={pageSize}
					/>
				);
			}}
		</PageLoader>
	);
}

function ReviewApplication({
	community,
	userId,
	page,
	pageSize,
}: {
	community: SubadminCommunity;
	userId: string;
	page: number;
	pageSize: number;
}) {
	const navigate = Route.useNavigate();
	const rejectionReasonId = useId();
	const queryClient = useQueryClient();
	const [rejectionReason, setRejectionReason] = useState("");
	const [showReject, setShowReject] = useState(false);
	const applicationQuery = useQuery({
		queryKey: ["subadmin", "kyc", "pending", community.id, page, pageSize],
		queryFn: () =>
			subadminService.getPendingKyc(community.id, { page, limit: pageSize }),
	});
	const review = useMutation({
		mutationFn: ({
			action,
			reason,
		}: {
			action: "accept" | "reject";
			reason?: string;
		}) =>
			action === "accept"
				? subadminService.acceptKyc(community.id, userId)
				: subadminService.rejectKyc(community.id, userId, reason ?? ""),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["subadmin", "kyc", "pending", community.id],
				}),
				queryClient.invalidateQueries({
					queryKey: ["subadmin", "communities"],
				}),
			]);
			toast.success(
				variables.action === "accept"
					? "Application approved"
					: "Application rejected",
			);
			navigate({
				to: "/community/tenants",
				search: { communityId: community.id, page, pageSize },
			});
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});
	function submitRejection(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const reason = rejectionReason.trim();
		if (reason) review.mutate({ action: "reject", reason });
	}

	return (
		<div className="mx-auto max-w-4xl space-y-7">
			<Link
				to="/community/tenants"
				search={{ communityId: community.id, page, pageSize }}
				className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
			>
				<ArrowLeft aria-hidden="true" className="size-4" /> Back to tenants
			</Link>
			<PageLoader query={applicationQuery} loadingText="Loading application...">
				{(response) => {
					const application = response.payload?.data?.find(
						(item: KycSubmission) => item.userId === userId,
					);
					if (!application)
						return (
							<div className="rounded-box border border-base-300 bg-base-100 p-8">
								<h1 className="text-xl font-semibold">
									Application unavailable
								</h1>
								<p className="mt-2 text-sm text-base-content/70">
									This application is no longer on the selected pending page. It
									may have already been reviewed.
								</p>
							</div>
						);
					return (
						<>
							<div className="space-y-2">
								<h1 className="text-3xl font-semibold tracking-tight">
									Review tenant application
								</h1>
								<p className="text-sm text-base-content/70">{community.name}</p>
							</div>
							<section
								className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8"
								aria-label="Applicant details"
							>
								<div className="flex items-center gap-4 border-b border-base-300 pb-5">
									<span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
										<UserRound aria-hidden="true" className="size-6" />
									</span>
									<div>
										<h2 className="text-xl font-semibold">
											{application.userName || application.userId}
										</h2>
										<p className="text-sm text-base-content/70">
											{application.userEmail || "Email unavailable"}
										</p>
									</div>
								</div>
								<dl className="mt-4 divide-y divide-base-300">
									{[
										{ label: "Status", value: application.status },
										{
											label: "Submitted",
											value: application.submittedAt
												? new Date(application.submittedAt).toLocaleString()
												: "Unavailable",
										},
									].map(({ label, value }) => (
										<div
											key={label}
											className="grid gap-1 py-3 text-sm sm:grid-cols-[9rem_1fr]"
										>
											<dt className="text-base-content/65">{label}</dt>
											<dd className="font-medium">{value}</dd>
										</div>
									))}
								</dl>
							</section>
							<section
								className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8"
								aria-label="Identity documents"
							>
								<h2 className="text-xl font-semibold">Identity documents</h2>
								{application.documents?.length ? (
									<ul className="mt-4 divide-y divide-base-300">
										{application.documents.map((document, index) => (
											<li
												key={`${document.url}-${index}`}
												className="flex items-center gap-3 py-3"
											>
												<FileText
													aria-hidden="true"
													className="size-5 text-primary"
												/>
												<span className="flex-1 text-sm font-medium">
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
									<p className="mt-3 text-sm text-base-content/70">
										No documents were included in this application.
									</p>
								)}
							</section>
							<div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
								<h2 className="text-xl font-semibold">Decision</h2>
								<p className="text-sm text-base-content/70">
									Approve this person’s access or provide a reason for
									declining.
								</p>
								<div className="flex flex-wrap gap-3">
									<button
										type="button"
										className="btn btn-primary"
										disabled={review.isPending}
										onClick={() => review.mutate({ action: "accept" })}
									>
										Approve application
									</button>
									<button
										type="button"
										className="btn btn-outline btn-error"
										disabled={review.isPending}
										onClick={() => setShowReject((value) => !value)}
									>
										Reject application
									</button>
								</div>
								{showReject && (
									<form onSubmit={submitRejection} className="space-y-3">
										<label
											className="block text-sm font-medium"
											htmlFor={rejectionReasonId}
										>
											Reason for rejection
										</label>
										<textarea
											id={rejectionReasonId}
											className="textarea textarea-bordered w-full"
											value={rejectionReason}
											onChange={(event) =>
												setRejectionReason(event.target.value)
											}
											required
											minLength={3}
											maxLength={500}
										/>
										<button
											type="submit"
											className="btn btn-error"
											disabled={
												review.isPending || rejectionReason.trim().length < 3
											}
										>
											Confirm rejection
										</button>
									</form>
								)}
							</div>
						</>
					);
				}}
			</PageLoader>
		</div>
	);
}
