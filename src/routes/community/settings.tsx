import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, MapPin, Save } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/layout/PageLoader";
import { extract_message } from "@/lib/api-error";
import { subadminService } from "@/services/subadmin.service";
import type { SubadminCommunity, UpdateCommunityDto } from "@/services/types";

type SettingsSearch = { communityId?: string };

export const Route = createFileRoute("/community/settings")({
	validateSearch: (search: Record<string, unknown>): SettingsSearch => ({
		communityId:
			typeof search.communityId === "string" && search.communityId.trim()
				? search.communityId.trim()
				: undefined,
	}),
	component: CommunitySettingsPage,
});

function CommunitySettingsPage() {
	const navigate = Route.useNavigate();
	const { communityId } = Route.useSearch();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<PageLoader
			query={communitiesQuery}
			loadingText="Loading community settings..."
			emptyState={{
				title: "No communities to manage",
				description:
					"Community settings will appear once a community is assigned to you.",
			}}
		>
			{(response) => {
				const communities = response.payload.data;
				const selected =
					communities.find((community) => community.id === communityId) ??
					communities[0];
				if (!selected) return null;
				return (
					<div className="mx-auto max-w-4xl space-y-7">
						<div>
							<Link
								to="/community/community/$communityId"
								params={{ communityId: selected.id }}
								className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							>
								<ArrowLeft aria-hidden="true" className="size-4" /> Back to
								community
							</Link>
							<h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
								Community settings
							</h1>
							<p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
								Keep your community details accurate and up to date.
							</p>
						</div>
						{communities.length > 1 && (
							<label className="flex max-w-sm flex-col gap-2 text-sm font-medium">
								Community
								<select
									className="select select-bordered w-full bg-base-100"
									value={selected.id}
									onChange={(event) =>
										navigate({
											search: { communityId: event.target.value },
											replace: true,
										})
									}
								>
									{communities.map((community) => (
										<option key={community.id} value={community.id}>
											{community.name}
										</option>
									))}
								</select>
							</label>
						)}
						<CommunitySettingsForm key={selected.id} community={selected} />
					</div>
				);
			}}
		</PageLoader>
	);
}

function CommunitySettingsForm({
	community,
}: {
	community: SubadminCommunity;
}) {
	const queryClient = useQueryClient();
	const [form, setForm] = useState<UpdateCommunityDto>({
		name: community.name,
		description: community.description ?? "",
		address: community.address ?? "",
		state: community.state ?? "",
	});
	const isDirty =
		form.name !== community.name ||
		form.description !== (community.description ?? "") ||
		form.address !== (community.address ?? "") ||
		form.state !== (community.state ?? "");
	const save = useMutation({
		mutationFn: (data: UpdateCommunityDto) =>
			subadminService.updateManagedCommunity(community.id, data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["subadmin", "communities"],
			});
			toast.success("Community details updated");
		},
		onError: (error) => toast.error(extract_message(error)),
	});

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const name = form.name?.trim();
		if (!name) return;
		save.mutate({
			name,
			description: form.description?.trim() ?? "",
			address: form.address?.trim() ?? "",
			state: form.state?.trim() ?? "",
		});
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="overflow-hidden rounded-box border border-base-300 bg-base-100"
		>
			<div className="flex items-start gap-4 border-b border-base-300 p-6 sm:p-8">
				<span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Building2 aria-hidden="true" className="size-5" />
				</span>
				<div>
					<h2 className="text-lg font-semibold">Community profile</h2>
					<p className="mt-1 text-sm text-base-content/70">
						Name, location, and a short description.
					</p>
				</div>
			</div>
			<div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
				<label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
					Community name
					<input
						className="input input-bordered w-full"
						required
						maxLength={120}
						value={form.name ?? ""}
						onChange={(event) =>
							setForm((prev) => ({ ...prev, name: event.target.value }))
						}
					/>
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium sm:col-span-2">
					Description
					<textarea
						className="textarea textarea-bordered min-h-28 w-full"
						maxLength={500}
						value={form.description ?? ""}
						onChange={(event) =>
							setForm((prev) => ({ ...prev, description: event.target.value }))
						}
						placeholder="What should people know about this community?"
					/>
				</label>
				<div className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
					<MapPin aria-hidden="true" className="size-4 text-primary" /> Location
				</div>
				<label className="flex flex-col gap-2 text-sm font-medium">
					Address
					<input
						className="input input-bordered w-full"
						maxLength={200}
						value={form.address ?? ""}
						onChange={(event) =>
							setForm((prev) => ({ ...prev, address: event.target.value }))
						}
					/>
				</label>
				<label className="flex flex-col gap-2 text-sm font-medium">
					State
					<input
						className="input input-bordered w-full"
						maxLength={100}
						value={form.state ?? ""}
						onChange={(event) =>
							setForm((prev) => ({ ...prev, state: event.target.value }))
						}
					/>
				</label>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 bg-base-200/50 px-6 py-4 sm:px-8">
				<p className="text-xs text-base-content/65">
					Changes to these details are reflected on your dashboard.
				</p>
				<button
					type="submit"
					className="btn btn-primary gap-2"
					disabled={!isDirty || save.isPending || !form.name?.trim()}
				>
					{save.isPending ? (
						<span className="loading loading-spinner loading-xs" />
					) : (
						<Save aria-hidden="true" className="size-4" />
					)}
					{save.isPending ? "Saving..." : "Save changes"}
				</button>
			</div>
		</form>
	);
}
