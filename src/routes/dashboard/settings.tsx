import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

// Full page code is backed up in settings-BACKUP.tsx

export const Route = createFileRoute("/dashboard/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<>
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<div className="p-6 bg-primary/10 rounded-full">
							<Settings className="w-16 h-16 text-primary" />
						</div>
					</div>
					<h2 className="text-2xl font-bold text-gray-900">Settings</h2>
					<p className="text-gray-600 max-w-md">
						This page is coming soon. We're working on bringing you
						comprehensive system configuration and preferences.
					</p>
				</div>
			</div>
		</>
	);
}
