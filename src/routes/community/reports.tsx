import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/reports")({
	component: ReportsPage,
});

function ReportsPage() {
	return (
		<WorkspacePage
			title="Reports"
			description="Review activity and trends across your community."
			panelTitle="Community reports"
			panelDescription="Activity and performance reports will be available here."
			icon={BarChart3}
		/>
	);
}
