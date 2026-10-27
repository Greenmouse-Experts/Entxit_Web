import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { CommunityDetailsProvider } from "@/components/community/CommunityDetailsContext";
import PageLoader from "@/components/layout/PageLoader";
import { subadminService } from "@/services/subadmin.service";

export const Route = createFileRoute("/community/community/$communityId")({
	component: CommunityLayout,
});

function CommunityLayout() {
	const { communityId } = Route.useParams();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<PageLoader
			query={communitiesQuery}
			loadingText="Loading community..."
			emptyState={{
				title: "No communities yet",
				description: "Your managed communities will appear here once assigned.",
			}}
		>
			{(response) => {
				const community = response.payload.data.find(
					(item) => item.id === communityId,
				);
				if (!community) {
					return (
						<div className="rounded-box border border-base-300 bg-base-100 p-8">
							<h1 className="text-2xl font-semibold">Community unavailable</h1>
							<p className="mt-2 text-sm text-base-content/70">
								This community is not assigned to your account.
							</p>
							<Link to="/community" className="btn btn-primary btn-sm mt-5">
								View communities
							</Link>
						</div>
					);
				}
				const location = [community.address, community.state]
					.filter(Boolean)
					.join(", ");
				return (
					<CommunityDetailsProvider community={community}>
						<div className="space-y-7">
							<div className="space-y-5">
								<Link
									to="/community"
									className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
								>
									<ArrowLeft aria-hidden="true" className="size-4" /> All
									communities
								</Link>
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div className="space-y-2">
										<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
											{community.name}
										</h1>
										<p className="text-sm text-base-content/70">
											{community.hostCategoryName || "Community"}
											{location && (
												<span className="ml-3 inline-flex items-center gap-1">
													<MapPin aria-hidden="true" className="size-4" />{" "}
													{location}
												</span>
											)}
										</p>
									</div>
									{community.status && (
										<span
											className={`badge badge-soft capitalize ${community.status.toLowerCase() === "active" ? "badge-success" : "badge-warning"}`}
										>
											{community.status}
										</span>
									)}
								</div>
							</div>
							<nav
								aria-label="Community sections"
								className="flex gap-1 border-b border-base-300"
							>
								<Link
									to="/community/community/$communityId"
									params={{ communityId }}
									activeOptions={{ exact: true }}
									className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content"
									activeProps={{ className: "border-primary text-primary" }}
								>
									Overview
								</Link>
								<Link
									to="/community/community/$communityId/tenants"
									params={{ communityId }}
									className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content"
									activeProps={{ className: "border-primary text-primary" }}
								>
									Tenants
								</Link>
								<Link
									to="/community/community/$communityId/announcements"
									params={{ communityId }}
									className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-base-content/70 hover:text-base-content"
									activeProps={{ className: "border-primary text-primary" }}
								>
									Announcements
								</Link>
							</nav>
							<Outlet />
						</div>
					</CommunityDetailsProvider>
				);
			}}
		</PageLoader>
	);
}
