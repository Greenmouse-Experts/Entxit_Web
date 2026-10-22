import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Full page code is backed up in reports-BACKUP.tsx
// Restore from backup to get full functionality

export const Route = createFileRoute("/dashboard/reports")({
	component: ReportsPage,
});

function ReportsPage() {
	return (
		<DashboardLayout>
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<div className="p-6 bg-primary/10 rounded-full">
							<BarChart3 className="w-16 h-16 text-primary" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900">
						Reports & Analytics
					</h2>
					<p className="text-gray-600 max-w-md">
						This page is coming soon. We're working on bringing you
						comprehensive analytics and reporting features.
					</p>
				</div>
			</div>
		</DashboardLayout>
	);
}
