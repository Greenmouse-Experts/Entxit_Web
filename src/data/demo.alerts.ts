export interface SecurityAlert {
	id: string;
	type: "panic" | "suspicious" | "unauthorized" | "emergency";
	severity: "low" | "medium" | "high" | "critical";
	title: string;
	description: string;
	organisationId: string;
	organisationName: string;
	location: string;
	reportedBy: string;
	reportedByRole: "resident" | "guard" | "system";
	status: "new" | "acknowledged" | "investigating" | "resolved";
	createdAt: string;
	acknowledgedAt?: string;
	resolvedAt?: string;
}

export const demoSecurityAlerts: SecurityAlert[] = [
	{
		id: "alert-1",
		type: "panic",
		severity: "critical",
		title: "Panic Button Activated",
		description: "Resident activated panic button in Building A, Unit 204",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		location: "Building A, Unit 204",
		reportedBy: "John Doe",
		reportedByRole: "resident",
		status: "resolved",
		createdAt: "2024-12-08T14:30:00Z",
		acknowledgedAt: "2024-12-08T14:31:00Z",
		resolvedAt: "2024-12-08T14:45:00Z",
	},
	{
		id: "alert-2",
		type: "suspicious",
		severity: "medium",
		title: "Suspicious Activity Detected",
		description: "Unknown vehicle parked in restricted area for over 2 hours",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		location: "Parking Lot B",
		reportedBy: "David Martinez",
		reportedByRole: "guard",
		status: "investigating",
		createdAt: "2024-12-09T10:15:00Z",
		acknowledgedAt: "2024-12-09T10:20:00Z",
	},
	{
		id: "alert-3",
		type: "unauthorized",
		severity: "high",
		title: "Unauthorized Entry Attempt",
		description: "Failed access attempt at gate 2, unrecognized access card",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		location: "Gate 2",
		reportedBy: "Security System",
		reportedByRole: "system",
		status: "new",
		createdAt: "2024-12-09T08:45:00Z",
	},
	{
		id: "alert-4",
		type: "emergency",
		severity: "critical",
		title: "Fire Alarm Triggered",
		description: "Fire alarm activated in Building C, Floor 3",
		organisationId: "4",
		organisationName: "Greenfield Apartments",
		location: "Building C, Floor 3",
		reportedBy: "Fire Detection System",
		reportedByRole: "system",
		status: "acknowledged",
		createdAt: "2024-12-09T09:30:00Z",
		acknowledgedAt: "2024-12-09T09:31:00Z",
	},
	{
		id: "alert-5",
		type: "suspicious",
		severity: "low",
		title: "Loitering Reported",
		description: "Individual loitering near playground area",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		location: "Playground Area",
		reportedBy: "Jane Smith",
		reportedByRole: "resident",
		status: "resolved",
		createdAt: "2024-12-07T16:20:00Z",
		acknowledgedAt: "2024-12-07T16:25:00Z",
		resolvedAt: "2024-12-07T16:40:00Z",
	},
];

export interface Announcement {
	id: string;
	title: string;
	message: string;
	type: "system" | "maintenance" | "emergency" | "general";
	priority: "low" | "medium" | "high";
	targetAudience: "all" | "organisations" | "residents" | "guards";
	organisationIds?: string[];
	createdBy: string;
	createdAt: string;
	scheduledFor?: string;
	status: "draft" | "scheduled" | "sent";
}

export const demoAnnouncements: Announcement[] = [
	{
		id: "ann-1",
		title: "System Maintenance Scheduled",
		message:
			"Our system will undergo maintenance on Dec 15, 2024 from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.",
		type: "system",
		priority: "high",
		targetAudience: "all",
		createdBy: "Admin User",
		createdAt: "2024-12-01T10:00:00Z",
		scheduledFor: "2024-12-15T02:00:00Z",
		status: "scheduled",
	},
	{
		id: "ann-2",
		title: "New Features Available",
		message:
			"We have added new analytics features to help you track visitor patterns and security metrics.",
		type: "general",
		priority: "low",
		targetAudience: "organisations",
		createdBy: "Admin User",
		createdAt: "2024-11-28T14:30:00Z",
		status: "sent",
	},
];
