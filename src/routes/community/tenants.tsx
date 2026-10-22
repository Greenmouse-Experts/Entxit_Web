import { createFileRoute } from "@tanstack/react-router";
import { UsersRound } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/tenants")({
	component: TenantsPage,
});

function TenantsPage() {
	return (
		<WorkspacePage
			title="Tenants"
			description="Keep track of the people who live or work in your community."
			panelTitle="Tenant directory"
			panelDescription="Tenant records and access details will be managed here."
			icon={UsersRound}
		/>
	);
}
