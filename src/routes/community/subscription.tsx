import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { WorkspacePage } from "@/components/community/WorkspacePage";

export const Route = createFileRoute("/community/subscription")({
	component: SubscriptionPage,
});

function SubscriptionPage() {
	return (
		<WorkspacePage
			title="Subscription"
			description="See the plan and billing information for your community."
			panelTitle="Plan and billing"
			panelDescription="Your subscription details and invoices will be managed here."
			icon={CreditCard}
		/>
	);
}
