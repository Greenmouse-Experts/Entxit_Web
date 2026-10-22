import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
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
	"/dashboard/organisations/host-visitors/$hostId",
)({
	component: HostVisitorsPage,
});

// Demo data for visitors
const demoVisitors = [
	{
		id: 1,
		name: "Alice Johnson",
		phone: "+234 807 123 4567",
		purpose: "Business Meeting",
		checkIn: "2024-01-15 10:30 AM",
		checkOut: "2024-01-15 2:45 PM",
		status: "completed",
		vehicle: "ABC-123-XY",
	},
	{
		id: 2,
		name: "Bob Williams",
		phone: "+234 808 234 5678",
		purpose: "Social Visit",
		checkIn: "2024-01-16 3:15 PM",
		checkOut: null,
		status: "checked-in",
		vehicle: "DEF-456-ZW",
	},
	{
		id: 3,
		name: "Carol Brown",
		phone: "+234 809 345 6789",
		purpose: "Delivery",
		checkIn: "2024-01-16 9:00 AM",
		checkOut: "2024-01-16 9:15 AM",
		status: "completed",
		vehicle: null,
	},
	{
		id: 4,
		name: "David Miller",
		phone: "+234 810 456 7890",
		purpose: "Maintenance",
		checkIn: "2024-01-14 1:00 PM",
		checkOut: "2024-01-14 5:30 PM",
		status: "completed",
		vehicle: "GHI-789-UV",
	},
	{
		id: 5,
		name: "Eve Davis",
		phone: "+234 811 567 8901",
		purpose: "Family Visit",
		checkIn: "2024-01-13 6:00 PM",
		checkOut: "2024-01-13 10:00 PM",
		status: "completed",
		vehicle: null,
	},
];

function HostVisitorsPage() {
	const hostName = "John Doe";
	const hostApartment = "Block A, Flat 12";

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "neutral";
			case "checked-in":
				return "success";
			case "scheduled":
				return "warning";
			default:
				return "neutral";
		}
	};

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
						<h1 className="text-3xl font-bold text-gray-900">Host Visitors</h1>
						<p className="mt-1 text-gray-600">
							Viewing visitors for{" "}
							<span className="font-semibold">{hostName}</span> ({hostApartment}
							)
						</p>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
									<User className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">Total Visitors</div>
									<div className="text-2xl font-bold text-gray-900">
										{demoVisitors.length}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
									<Clock className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">
										Currently Visiting
									</div>
									<div className="text-2xl font-bold text-gray-900">
										{
											demoVisitors.filter((v) => v.status === "checked-in")
												.length
										}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
									<Calendar className="w-6 h-6 text-purple-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">This Month</div>
									<div className="text-2xl font-bold text-gray-900">12</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
									<MapPin className="w-6 h-6 text-amber-600" />
								</div>
								<div>
									<div className="text-sm text-gray-600">With Vehicle</div>
									<div className="text-2xl font-bold text-gray-900">
										{demoVisitors.filter((v) => v.vehicle).length}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Visitors Table */}
				<Card>
					<CardHeader>
						<CardTitle>Visitor History</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Visitor</TableHead>
									<TableHead>Purpose</TableHead>
									<TableHead>Check In</TableHead>
									<TableHead>Check Out</TableHead>
									<TableHead>Vehicle</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{demoVisitors.map((visitor) => (
									<TableRow key={visitor.id}>
										<TableCell>
											<div className="font-medium text-gray-900">
												{visitor.name}
											</div>
											<div className="text-sm text-gray-500">
												{visitor.phone}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="outline">{visitor.purpose}</Badge>
										</TableCell>
										<TableCell>
											<div className="text-sm">{visitor.checkIn}</div>
										</TableCell>
										<TableCell>
											<div className="text-sm">
												{visitor.checkOut || (
													<span className="text-gray-400">Still visiting</span>
												)}
											</div>
										</TableCell>
										<TableCell>
											{visitor.vehicle ? (
												<div className="flex items-center gap-1">
													<MapPin className="w-4 h-4 text-gray-400" />
													<span className="text-sm font-mono">
														{visitor.vehicle}
													</span>
												</div>
											) : (
												<span className="text-sm text-gray-400">
													No vehicle
												</span>
											)}
										</TableCell>
										<TableCell>
											<Badge variant={getStatusColor(visitor.status)}>
												{visitor.status}
											</Badge>
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
