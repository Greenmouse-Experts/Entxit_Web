import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/Tabs";
import { demoAnnouncements } from "../../data/demo.alerts";

export const Route = createFileRoute("/dashboard/announcements")({
	component: AnnouncementsPage,
});

function AnnouncementsPage() {
	return (
		<>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
						<p className="mt-1 text-gray-600">
							Create and manage system-wide broadcasts
						</p>
					</div>
					<Button>
						<Plus className="w-4 h-4" />
						New Announcement
					</Button>
				</div>

				<Tabs defaultValue="all">
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="scheduled">Scheduled</TabsTrigger>
						<TabsTrigger value="sent">Sent</TabsTrigger>
						<TabsTrigger value="draft">Drafts</TabsTrigger>
					</TabsList>

					<TabsContent value="all">
						<div className="space-y-4">
							{demoAnnouncements.map((announcement) => (
								<Card key={announcement.id}>
									<CardContent className="p-6">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-lg font-semibold text-gray-900">
														{announcement.title}
													</h3>
													<Badge
														variant={
															announcement.priority === "high"
																? "danger"
																: announcement.priority === "medium"
																	? "warning"
																	: "info"
														}
													>
														{announcement.priority}
													</Badge>
													<Badge variant="outline">{announcement.type}</Badge>
												</div>
												<p className="text-gray-600 mb-4">
													{announcement.message}
												</p>
												<div className="flex items-center gap-4 text-sm text-gray-500">
													<span>Target: {announcement.targetAudience}</span>
													<span>•</span>
													<span>
														Created:{" "}
														{new Date(
															announcement.createdAt,
														).toLocaleDateString()}
													</span>
													{announcement.scheduledFor && (
														<>
															<span>•</span>
															<span>
																Scheduled:{" "}
																{new Date(
																	announcement.scheduledFor,
																).toLocaleDateString()}
															</span>
														</>
													)}
												</div>
											</div>
											<Badge
												variant={
													announcement.status === "sent"
														? "success"
														: announcement.status === "scheduled"
															? "warning"
															: "neutral"
												}
											>
												{announcement.status}
											</Badge>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
