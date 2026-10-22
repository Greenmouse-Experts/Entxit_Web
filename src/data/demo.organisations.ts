export interface Organisation {
	id: string;
	name: string;
	type: "HOA" | "Estate" | "Company";
	status: "active" | "trial" | "suspended";
	logo?: string;
	plan: "basic" | "premium" | "enterprise";
	admins: number;
	residents: number;
	guards: number;
	createdAt: string;
	subscriptionExpiry: string;
	monthlyRevenue: number;
}

export const demoOrganisations: Organisation[] = [
	{
		id: "1",
		name: "Royal Gardens Estate",
		type: "Estate",
		status: "active",
		plan: "premium",
		admins: 3,
		residents: 245,
		guards: 12,
		createdAt: "2024-01-15",
		subscriptionExpiry: "2025-01-15",
		monthlyRevenue: 1200,
	},
	{
		id: "2",
		name: "Sunset Villas HOA",
		type: "HOA",
		status: "active",
		plan: "enterprise",
		admins: 5,
		residents: 580,
		guards: 24,
		createdAt: "2023-08-20",
		subscriptionExpiry: "2025-08-20",
		monthlyRevenue: 2500,
	},
	{
		id: "3",
		name: "Tech Hub Business Park",
		type: "Company",
		status: "trial",
		plan: "basic",
		admins: 2,
		residents: 120,
		guards: 8,
		createdAt: "2024-11-10",
		subscriptionExpiry: "2024-12-10",
		monthlyRevenue: 0,
	},
	{
		id: "4",
		name: "Greenfield Apartments",
		type: "Estate",
		status: "active",
		plan: "premium",
		admins: 4,
		residents: 320,
		guards: 15,
		createdAt: "2024-03-05",
		subscriptionExpiry: "2025-03-05",
		monthlyRevenue: 1500,
	},
	{
		id: "5",
		name: "Lakeside Community",
		type: "HOA",
		status: "suspended",
		plan: "basic",
		admins: 2,
		residents: 150,
		guards: 6,
		createdAt: "2023-12-01",
		subscriptionExpiry: "2024-11-30",
		monthlyRevenue: 0,
	},
];
