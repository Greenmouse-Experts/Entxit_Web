import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ManagedTypePanel } from "@/components/organisations/ManagedTypePanel";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";

export const Route = createFileRoute("/dashboard/organisations/types")({
	component: TypesPage,
});

function TypesPage() {
	const [categoryName, setCategoryName] = useState("");
	const createCategory = useMutation({
		mutationFn: (name: string) => adminService.createHostCategory({ name }),
		onSuccess: () => {
			setCategoryName("");
			toast.success("Host category created");
		},
		onError: () => toast.error("Could not create host category"),
	});
	return (
		<OrganisationShell
			title="Community types"
			description="Maintain the options used when communities and KYC documents are created."
		>
			<div className="grid gap-5 xl:grid-cols-2">
				<ManagedTypePanel
					title="Community types"
					description="Community classifications available to the platform."
					queryKey="community-types"
					load={async () =>
						(await adminService.getHostCommunityTypes()).payload
					}
					create={(name) => adminService.createHostCommunityType({ name })}
					remove={adminService.deleteHostCommunityType}
				/>
				<ManagedTypePanel
					title="KYC document types"
					description="Identity document options shown to applicants."
					queryKey="kyc-document-types"
					load={async () => (await adminService.getKycDocumentTypes()).payload}
					create={(name) => adminService.createKycDocumentType({ name })}
					remove={adminService.deleteKycDocumentType}
				/>
			</div>
			<section className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
				<h2 className="text-lg font-semibold">New host category</h2>
				<p className="mt-1 text-sm text-base-content/60">
					The API supports creating a category. Category listing is not
					available from this admin endpoint.
				</p>
				<form
					className="mt-4 flex flex-wrap gap-2"
					onSubmit={(event) => {
						event.preventDefault();
						if (categoryName.trim()) createCategory.mutate(categoryName.trim());
					}}
				>
					<input
						className="input input-bordered min-w-48 flex-1"
						aria-label="New host category name"
						placeholder="Category name"
						value={categoryName}
						onChange={(event) => setCategoryName(event.target.value)}
						required
					/>
					<button
						type="submit"
						className="btn btn-primary"
						disabled={!categoryName.trim() || createCategory.isPending}
					>
						Create category
					</button>
				</form>
			</section>
		</OrganisationShell>
	);
}
