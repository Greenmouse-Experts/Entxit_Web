import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Building2,
	CreditCard,
	Megaphone,
	Plus,
	Users,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { demoSecurityAlerts } from "../../data/demo.alerts";
import {
	demoDashboardStats,
	demoRevenueData,
	demoUserGrowthData,
} from "../../data/demo.dashboard";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardPage,
});

function DashboardPage() {
	const stats = demoDashboardStats;
	const recentAlerts = demoSecurityAlerts.filter(
		(alert) => alert.status === "new" || alert.status === "acknowledged",
	);

	return (
		<>
			<div className="space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
						<p className="mt-1 text-gray-600">
							Welcome back! Here's your system overview.
						</p>
					</div>
					<div className="flex gap-3">
						<Button variant="outline">
							<Megaphone className="w-4 h-4" />
							Broadcast
						</Button>
						<Button>
							<Plus className="w-4 h-4" />
							Add Organisation
						</Button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard
						title="Total Organisations"
						value={stats.totalOrganisations}
						icon={<Building2 className="w-6 h-6" />}
						trend={{
							value: "+2 this month",
							isPositive: true,
						}}
					/>
					<StatCard
						title="Active Subscriptions"
						value={stats.activeSubscriptions}
						description={`₦${stats.monthlyRevenue.toLocaleString()}/month`}
						icon={<CreditCard className="w-6 h-6" />}
						trend={{
							value: `${stats.revenueGrowth}%`,
							isPositive: true,
						}}
					/>
					<StatCard
						title="Pending Alerts"
						value={stats.pendingAlerts}
						description="Requires attention"
						icon={<AlertTriangle className="w-6 h-6" />}
						className={
							stats.pendingAlerts > 0 ? "border-red-200 bg-red-50" : ""
						}
					/>
					<StatCard
						title="New Visitors Today"
						value={stats.newVisitorsToday}
						icon={<Users className="w-6 h-6" />}
						trend={{
							value: "+15%",
							isPositive: true,
						}}
					/>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Revenue Trend */}
					<Card>
						<CardHeader>
							<CardTitle>Revenue Trend</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-80 flex items-end gap-2">
								{demoRevenueData.map((data) => (
									<div
										key={data.month}
										className="flex-1 flex flex-col items-center gap-2"
									>
										<div className="w-full flex flex-col items-center">
											<div
												className="w-full bg-blue-600 rounded-t hover:bg-blue-700 transition-colors cursor-pointer"
												style={{
													height: `${(data.revenue / 6000) * 250}px`,
												}}
											/>
										</div>
										<div className="text-xs text-gray-600 font-medium">
											{data.month}
										</div>
										<div className="text-xs text-gray-500">
											${(data.revenue / 1000).toFixed(1)}k
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* User Growth */}
					<Card>
						<CardHeader>
							<CardTitle>User Growth</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-80 flex items-end gap-2">
								{demoUserGrowthData.map((data) => (
									<div
										key={data.month}
										className="flex-1 flex flex-col items-center gap-2"
									>
										<div className="w-full flex flex-col items-center gap-0.5">
											<div
												className="w-full bg-primary hover:bg-primary/90 transition-colors cursor-pointer"
												style={{
													height: `${(data.residents / 1500) * 150}px`,
												}}
											/>
											<div
												className="w-full bg-success hover:bg-success/90 transition-colors cursor-pointer"
												style={{
													height: `${(data.guards / 70) * 60}px`,
												}}
											/>
											<div
												className="w-full bg-success hover:bg-success/90 transition-colors cursor-pointer"
												style={{
													height: `${(data.subAdmins / 15) * 40}px`,
												}}
											/>
										</div>
										<div className="text-xs text-gray-600 font-medium">
											{data.month}
										</div>
									</div>
								))}
							</div>
							<div className="mt-6 flex items-center justify-center gap-6">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-primary rounded" />
									<span className="text-sm text-gray-600">Residents</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-success rounded" />
									<span className="text-sm text-gray-600">Guards</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-success rounded" />
									<span className="text-sm text-gray-600">Sub-admins</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Alerts */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Recent Security Alerts</CardTitle>
							<Button variant="outline" size="sm">
								View All
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{recentAlerts.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								No pending alerts
							</div>
						) : (
							<div className="space-y-4">
								{recentAlerts.map((alert) => (
									<div
										key={alert.id}
										className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div
											className={`p-2 rounded-lg ${
												alert.severity === "critical"
													? "bg-red-100 text-red-600"
													: alert.severity === "high"
														? "bg-orange-100 text-orange-600"
														: alert.severity === "medium"
															? "bg-yellow-100 text-yellow-600"
															: "bg-blue-100 text-blue-600"
											}`}
										>
											<AlertTriangle className="w-5 h-5" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<h4 className="font-semibold text-gray-900">
														{alert.title}
													</h4>
													<p className="text-sm text-gray-600 mt-1">
														{alert.description}
													</p>
													<div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
														<span>{alert.organisationName}</span>
														<span>•</span>
														<span>{alert.location}</span>
														<span>•</span>
														<span>
															{new Date(alert.createdAt).toLocaleString()}
														</span>
													</div>
												</div>
												<div className="flex flex-col items-end gap-2">
													<Badge
														variant={
															alert.status === "new"
																? "danger"
																: alert.status === "acknowledged"
																	? "warning"
																	: "success"
														}
													>
														{alert.status}
													</Badge>
													<Badge variant="outline">{alert.severity}</Badge>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
