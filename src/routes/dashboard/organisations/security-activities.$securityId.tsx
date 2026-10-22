import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	AlertTriangle,
	ArrowLeft,
	CheckCircle,
	Clock,
	Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/Card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui/Table";

export const Route = createFileRoute(
	"/dashboard/organisations/security-activities/$securityId",
)({
	component: SecurityActivitiesPage,
});

// Demo data for security activities
const demoActivities = [
	{
		id: 1,
		timestamp: "2024-01-16 8:00 AM",
		type: "entry",
		visitorName: "John Smith",
		action: "Visitor Check-In",
		notes: "Business meeting with Apartment 12",
		duration: "2.5 hours",
	},
	{
		id: 2,
		timestamp: "2024-01-16 9:15 AM",
		type: "incident",
		visitorName: null,
		action: "Incident Report",
		notes: "Suspicious activity near Block C reported",
		duration: null,
	},
	{
		id: 3,
		timestamp: "2024-01-16 10:30 AM",
		type: "exit",
		visitorName: "Jane Doe",
		action: "Visitor Check-Out",
		notes: "Delivery completed",
		duration: "15 minutes",
	},
	{
		id: 4,
		timestamp: "2024-01-16 11:45 AM",
		type: "patrol",
		visitorName: null,
		action: "Routine Patrol",
		notes: "Perimeter check completed - all clear",
		duration: "45 minutes",
	},
	{
		id: 5,
		timestamp: "2024-01-16 1:00 PM",
		type: "entry",
		visitorName: "Mike Johnson",
		action: "Visitor Check-In",
		notes: "Maintenance contractor",
		duration: "3 hours",
	},
	{
		id: 6,
		timestamp: "2024-01-16 2:30 PM",
		type: "alert",
		visitorName: null,
		action: "Security Alert",
		notes: "Unauthorized vehicle parked in restricted zone",
		duration: null,
	},
	{
		id: 7,
		timestamp: "2024-01-16 3:15 PM",
		type: "exit",
		visitorName: "Sarah Williams",
		action: "Visitor Check-Out",
		notes: "Social visit concluded",
		duration: "1.5 hours",
	},
	{
		id: 8,
		timestamp: "2024-01-16 4:00 PM",
		type: "entry",
		visitorName: "Tom Brown",
		action: "Resident Return",
		notes: "Verified resident ID",
		duration: null,
	},
];

function SecurityActivitiesPage() {
	const securityName = "David Security";
	const securityShift = "Morning (8 AM - 4 PM)";

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "entry":
				return <CheckCircle className="w-5 h-5 text-green-600" />;
			case "exit":
				return <CheckCircle className="w-5 h-5 text-blue-600" />;
			case "incident":
				return <AlertTriangle className="w-5 h-5 text-red-600" />;
			case "alert":
				return <AlertTriangle className="w-5 h-5 text-amber-600" />;
			case "patrol":
				return <Activity className="w-5 h-5 text-purple-600" />;
			default:
				return <Activity className="w-5 h-5 text-gray-600" />;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case "entry":
				return "success";
			case "exit":
				return "default";
			case "incident":
				return "danger";
			case "alert":
				return "warning";
			case "patrol":
				return "purple";
			default:
				return "neutral";
		}
	};

	const entriesCount = demoActivities.filter((a) => a.type === "entry").length;
	const exitsCount = demoActivities.filter((a) => a.type === "exit").length;
	const incidentsCount = demoActivities.filter(
		(a) => a.type === "incident" || a.type === "alert",
	).length;
	const patrolsCount = demoActivities.filter((a) => a.type === "patrol").length;

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header with Back Button */}
				<div className="flex items-center gap-4">
					<Link to="/dashboard/organisations">
						<Button variant="outline" size="sm">
							<ArrowLeft className="w-4 h-4" />
							Back to Organisations
						</Button>
					</Link>
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-900">
							Security Activities
						</h1>
						<p className="mt-1 text-gray-600">
							Viewing activities for{" "}
							<span className="font-semibold">{securityName}</span> (
							{securityShift})
						</p>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Check-Ins</div>
									<div className="text-2xl font-bold text-gray-900">
										{entriesCount}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
									<CheckCircle className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Check-Outs</div>
									<div className="text-2xl font-bold text-gray-900">
										{exitsCount}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
									<AlertTriangle className="w-6 h-6 text-red-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Incidents/Alerts</div>
									<div className="text-2xl font-bold text-gray-900">
										{incidentsCount}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
									<Activity className="w-6 h-6 text-purple-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Patrols</div>
									<div className="text-2xl font-bold text-gray-900">
										{patrolsCount}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Activities Table */}
				<Card>
					<CardHeader>
						<CardTitle>Activity Log</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Timestamp</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Action</TableHead>
									<TableHead>Visitor/Notes</TableHead>
									<TableHead>Duration</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{demoActivities.map((activity) => (
									<TableRow key={activity.id}>
										<TableCell>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4 text-gray-400" />
												<span className="text-sm">{activity.timestamp}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												{getActivityIcon(activity.type)}
												<Badge variant={getActivityColor(activity.type)}>
													{activity.type}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium text-gray-900">
												{activity.action}
											</div>
										</TableCell>
										<TableCell>
											{activity.visitorName && (
												<div className="flex items-center gap-1 mb-1">
													<Users className="w-4 h-4 text-gray-400" />
													<span className="font-medium text-sm">
														{activity.visitorName}
													</span>
												</div>
											)}
											<div className="text-sm text-gray-600">
												{activity.notes}
											</div>
										</TableCell>
										<TableCell>
											{activity.duration ? (
												<Badge variant="outline">{activity.duration}</Badge>
											) : (
												<span className="text-sm text-gray-400">-</span>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
