import { createFileRoute } from "@tanstack/react-router";
import { ManagedTypePanel } from "@/components/organisations/ManagedTypePanel";
import { OrganisationShell } from "@/components/organisations/OrganisationShell";
import { adminService } from "@/services/admin.service";
import { usersService } from "@/services/users.service";

export const Route = createFileRoute("/dashboard/organisations/types")({
	component: TypesPage,
});

function TypesPage() {
	return (
		<OrganisationShell
			title="Community types"
			description="Manage the classifications and document options used across communities."
		>
			<div className="grid gap-5 xl:grid-cols-2">
				<ManagedTypePanel
					title="Host categories"
					description="Categories available when creating a community."
					queryKey="host-categories"
					load={async () => (await usersService.getHostCategories()).payload}
					create={(name) => adminService.createHostCategory({ name })}
					addLabel="Add category"
					emptyMessage="No host categories have been added yet."
				/>
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
		</OrganisationShell>
	);
}
