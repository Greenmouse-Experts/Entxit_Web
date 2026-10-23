import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/announcements")({
	component: AnnouncementsPage,
});

function AnnouncementsPage() {
	return (
		<WorkspacePage
			title="Announcements"
			description="Keep everyone in your community informed with news and notices."
			panelTitle="Announcements"
			panelDescription="Announcements you publish to your community will be managed here."
			icon={Megaphone}
		/>
	);
}
