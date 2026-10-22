import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/securities")({
	component: SecuritiesPage,
});

function SecuritiesPage() {
	return (
		<WorkspacePage
			title="Securities"
			description="Coordinate the people responsible for keeping your community secure."
			panelTitle="Security team"
			panelDescription="Security personnel and assignments will be managed here."
			icon={ShieldCheck}
		/>
	);
}
