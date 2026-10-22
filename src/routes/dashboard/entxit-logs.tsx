import { createFileRoute } from "@tanstack/react-router";
import { Edit, MoreVertical, Plus, Search, Upload } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/Table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/Tabs";
import {
	demoGuards,
	demoResidents,
	demoSubAdmins,
	demoSuperAdmins,
} from "../../data/demo.users";

export const Route = createFileRoute("/dashboard/entxit-logs")({
	component: UsersPage,
});

function UsersPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const filterUsers = (users: typeof demoResidents) => {
		return users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === "all" || user.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	};

	const getStatusColor = (
		status: "active" | "inactive" | "suspended",
	): "success" | "neutral" | "danger" => {
		switch (status) {
			case "active":
				return "success";
			case "inactive":
				return "neutral";
			case "suspended":
				return "danger";
		}
	};

	return (
		<>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							User Management
						</h1>
						<p className="mt-1 text-gray-600">
							Manage residents, security guards, sub-admins, and super admins
						</p>
					</div>
					<div className="flex gap-3">
						<Button variant="outline">
							<Upload className="w-4 h-4" />
							Bulk Import
						</Button>
						<Button>
							<Plus className="w-4 h-4" />
							Add User
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-gray-600">Total Residents</div>
							<div className="text-3xl font-bold text-primary mt-2">
								{demoResidents.length}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{demoResidents.filter((u) => u.status === "active").length}{" "}
								active
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-gray-600">Security Guards</div>
							<div className="text-3xl font-bold text-success mt-2">
								{demoGuards.length}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{demoGuards.filter((u) => u.status === "active").length} active
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-gray-600">Sub-Admins</div>
							<div className="text-3xl font-bold text-success mt-2">
								{demoSubAdmins.length}
							</div>
							<div className="text-xs text-gray-500 mt-1">
								{demoSubAdmins.filter((u) => u.status === "active").length}{" "}
								active
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="text-sm text-gray-600">Super Admins</div>
							<div className="text-3xl font-bold text-red-600 mt-2">
								{demoSuperAdmins.length}
							</div>
							<div className="text-xs text-gray-500 mt-1">Product level</div>
						</CardContent>
					</Card>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<Input
									placeholder="Search users..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
							<Select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								options={[
									{ value: "all", label: "All Status" },
									{ value: "active", label: "Active" },
									{ value: "inactive", label: "Inactive" },
									{ value: "suspended", label: "Suspended" },
								]}
								className="sm:w-48"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Tabs */}
				<Tabs defaultValue="residents">
					<TabsList>
						<TabsTrigger value="residents">
							Residents ({demoResidents.length})
						</TabsTrigger>
						<TabsTrigger value="guards">
							Guards ({demoGuards.length})
						</TabsTrigger>
						<TabsTrigger value="subadmins">
							Sub-Admins ({demoSubAdmins.length})
						</TabsTrigger>
						<TabsTrigger value="superadmins">
							Super Admins ({demoSuperAdmins.length})
						</TabsTrigger>
					</TabsList>

					{/* Residents Tab */}
					<TabsContent value="residents">
						<Card>
							<CardHeader>
								<CardTitle>Residents</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Contact</TableHead>
											<TableHead>Organisation</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Last Login</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filterUsers(demoResidents).map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
															{user.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</div>
														<div>
															<div className="font-medium text-gray-900">
																{user.name}
															</div>
															<div className="text-sm text-gray-500">
																ID: {user.id}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														<div>{user.email}</div>
														<div className="text-gray-500">{user.phone}</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.organisationName || "N/A"}
													</div>
												</TableCell>
												<TableCell>
													<Badge variant={getStatusColor(user.status)}>
														{user.status}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.lastLogin
															? new Date(user.lastLogin).toLocaleDateString()
															: "Never"}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center justify-end gap-2">
														<Button size="sm" variant="ghost">
															<Edit className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="ghost">
															<MoreVertical className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{filterUsers(demoResidents).length === 0 && (
									<div className="text-center py-12 text-gray-500">
										No residents found matching your criteria
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Guards Tab */}
					<TabsContent value="guards">
						<Card>
							<CardHeader>
								<CardTitle>Security Guards</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Contact</TableHead>
											<TableHead>Organisation</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Last Login</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filterUsers(demoGuards).map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-semibold">
															{user.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</div>
														<div>
															<div className="font-medium text-gray-900">
																{user.name}
															</div>
															<div className="text-sm text-gray-500">
																ID: {user.id}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														<div>{user.email}</div>
														<div className="text-gray-500">{user.phone}</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.organisationName || "N/A"}
													</div>
												</TableCell>
												<TableCell>
													<Badge variant={getStatusColor(user.status)}>
														{user.status}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.lastLogin
															? new Date(user.lastLogin).toLocaleDateString()
															: "Never"}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center justify-end gap-2">
														<Button size="sm" variant="ghost">
															<Edit className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="ghost">
															<MoreVertical className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{filterUsers(demoGuards).length === 0 && (
									<div className="text-center py-12 text-gray-500">
										No guards found matching your criteria
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Sub-Admins Tab */}
					<TabsContent value="subadmins">
						<Card>
							<CardHeader>
								<CardTitle>Sub-Admins</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Contact</TableHead>
											<TableHead>Organisation</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Last Login</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filterUsers(demoSubAdmins).map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-semibold">
															{user.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</div>
														<div>
															<div className="font-medium text-gray-900">
																{user.name}
															</div>
															<div className="text-sm text-gray-500">
																ID: {user.id}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														<div>{user.email}</div>
														<div className="text-gray-500">{user.phone}</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.organisationName || "N/A"}
													</div>
												</TableCell>
												<TableCell>
													<Badge variant={getStatusColor(user.status)}>
														{user.status}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.lastLogin
															? new Date(user.lastLogin).toLocaleDateString()
															: "Never"}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center justify-end gap-2">
														<Button size="sm" variant="ghost">
															<Edit className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="ghost">
															<MoreVertical className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								{filterUsers(demoSubAdmins).length === 0 && (
									<div className="text-center py-12 text-gray-500">
										No sub-admins found matching your criteria
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Super Admins Tab */}
					<TabsContent value="superadmins">
						<Card>
							<CardHeader>
								<CardTitle>Super Admins (Product Level)</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Contact</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Created</TableHead>
											<TableHead>Last Login</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filterUsers(demoSuperAdmins).map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
															{user.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</div>
														<div>
															<div className="font-medium text-gray-900">
																{user.name}
															</div>
															<div className="text-sm text-gray-500">
																ID: {user.id}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														<div>{user.email}</div>
														<div className="text-gray-500">{user.phone}</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge variant={getStatusColor(user.status)}>
														{user.status}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{new Date(user.createdAt).toLocaleDateString()}
													</div>
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{user.lastLogin
															? new Date(user.lastLogin).toLocaleDateString()
															: "Never"}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center justify-end gap-2">
														<Button size="sm" variant="ghost">
															<Edit className="w-4 h-4" />
														</Button>
														<Button size="sm" variant="ghost">
															<MoreVertical className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
}
