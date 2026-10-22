export interface Subscription {
	id: string;
	organisationId: string;
	organisationName: string;
	plan: "basic" | "premium" | "enterprise";
	status: "active" | "trial" | "expired" | "cancelled";
	amount: number;
	billingCycle: "monthly" | "yearly";
	startDate: string;
	nextBillingDate: string;
	features: string[];
}

export interface Invoice {
	id: string;
	organisationId: string;
	organisationName: string;
	amount: number;
	status: "paid" | "pending" | "overdue" | "cancelled";
	issueDate: string;
	dueDate: string;
	paidDate?: string;
	invoiceNumber: string;
}

export interface Plan {
	id: string;
	name: "basic" | "premium" | "enterprise";
	price: number;
	features: string[];
	maxResidents: number;
	maxGuards: number;
	maxAdmins: number;
}

export const demoPlans: Plan[] = [
	{
		id: "plan-1",
		name: "basic",
		price: 499,
		features: [
			"Up to 100 residents",
			"Up to 5 guards",
			"1 admin account",
			"Basic visitor management",
			"Email notifications",
			"Mobile app access",
		],
		maxResidents: 100,
		maxGuards: 5,
		maxAdmins: 1,
	},
	{
		id: "plan-2",
		name: "premium",
		price: 1299,
		features: [
			"Up to 500 residents",
			"Up to 20 guards",
			"5 admin accounts",
			"Advanced visitor management",
			"SMS & Email notifications",
			"Mobile app access",
			"Analytics dashboard",
			"Custom branding",
		],
		maxResidents: 500,
		maxGuards: 20,
		maxAdmins: 5,
	},
	{
		id: "plan-3",
		name: "enterprise",
		price: 2999,
		features: [
			"Unlimited residents",
			"Unlimited guards",
			"Unlimited admins",
			"Full visitor management suite",
			"Multi-channel notifications",
			"Mobile app access",
			"Advanced analytics & reports",
			"Custom branding",
			"API access",
			"Dedicated support",
			"Custom integrations",
		],
		maxResidents: -1,
		maxGuards: -1,
		maxAdmins: -1,
	},
];

export const demoSubscriptions: Subscription[] = [
	{
		id: "sub-1",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		plan: "premium",
		status: "active",
		amount: 1299,
		billingCycle: "monthly",
		startDate: "2024-01-15",
		nextBillingDate: "2025-01-15",
		features: demoPlans[1].features,
	},
	{
		id: "sub-2",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		plan: "enterprise",
		status: "active",
		amount: 2999,
		billingCycle: "monthly",
		startDate: "2023-08-20",
		nextBillingDate: "2025-08-20",
		features: demoPlans[2].features,
	},
	{
		id: "sub-3",
		organisationId: "3",
		organisationName: "Tech Hub Business Park",
		plan: "basic",
		status: "trial",
		amount: 0,
		billingCycle: "monthly",
		startDate: "2024-11-10",
		nextBillingDate: "2024-12-10",
		features: demoPlans[0].features,
	},
];

export const demoInvoices: Invoice[] = [
	{
		id: "inv-001",
		organisationId: "1",
		organisationName: "Royal Gardens Estate",
		amount: 1299,
		status: "paid",
		issueDate: "2024-11-01",
		dueDate: "2024-11-15",
		paidDate: "2024-11-10",
		invoiceNumber: "INV-2024-001",
	},
	{
		id: "inv-002",
		organisationId: "2",
		organisationName: "Sunset Villas HOA",
		amount: 2999,
		status: "paid",
		issueDate: "2024-11-01",
		dueDate: "2024-11-15",
		paidDate: "2024-11-12",
		invoiceNumber: "INV-2024-002",
	},
	{
		id: "inv-003",
		organisationId: "4",
		organisationName: "Greenfield Apartments",
		amount: 1299,
		status: "pending",
		issueDate: "2024-12-01",
		dueDate: "2024-12-15",
		invoiceNumber: "INV-2024-003",
	},
	{
		id: "inv-004",
		organisationId: "5",
		organisationName: "Lakeside Community",
		amount: 499,
		status: "overdue",
		issueDate: "2024-11-01",
		dueDate: "2024-11-15",
		invoiceNumber: "INV-2024-004",
	},
];
