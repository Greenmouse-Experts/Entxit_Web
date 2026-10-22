import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/community")({
	component: CommunityPage,
});

function CommunityPage() {
	return (
		<WorkspacePage
			title="Community"
			description="A home for the places and services your community shares."
			panelTitle="Community details"
			panelDescription="Facility information and shared spaces will be managed here."
			icon={Building2}
		/>
	);
}
