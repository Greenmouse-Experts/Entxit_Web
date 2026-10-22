export interface DashboardStats {
	totalOrganisations: number;
	activeSubscriptions: number;
	totalRevenue: number;
	monthlyRevenue: number;
	pendingAlerts: number;
	newVisitorsToday: number;
	totalResidents: number;
	totalGuards: number;
	totalSubAdmins: number;
	revenueGrowth: number;
	userGrowth: number;
}

export const demoDashboardStats: DashboardStats = {
	totalOrganisations: 5,
	activeSubscriptions: 3,
	totalRevenue: 45780,
	monthlyRevenue: 5198,
	pendingAlerts: 2,
	newVisitorsToday: 127,
	totalResidents: 1415,
	totalGuards: 65,
	totalSubAdmins: 14,
	revenueGrowth: 12.5,
	userGrowth: 8.3,
};

export interface RevenueData {
	month: string;
	revenue: number;
	subscriptions: number;
}

export const demoRevenueData: RevenueData[] = [
	{ month: "Jun", revenue: 4200, subscriptions: 2 },
	{ month: "Jul", revenue: 4650, subscriptions: 3 },
	{ month: "Aug", revenue: 4800, subscriptions: 3 },
	{ month: "Sep", revenue: 4950, subscriptions: 3 },
	{ month: "Oct", revenue: 4820, subscriptions: 3 },
	{ month: "Nov", revenue: 5198, subscriptions: 3 },
	{ month: "Dec", revenue: 5198, subscriptions: 3 },
];

export interface UserGrowthData {
	month: string;
	residents: number;
	guards: number;
	subAdmins: number;
}

export const demoUserGrowthData: UserGrowthData[] = [
	{ month: "Jun", residents: 980, guards: 45, subAdmins: 8 },
	{ month: "Jul", residents: 1050, guards: 48, subAdmins: 9 },
	{ month: "Aug", residents: 1120, guards: 52, subAdmins: 10 },
	{ month: "Sep", residents: 1200, guards: 55, subAdmins: 11 },
	{ month: "Oct", residents: 1280, guards: 58, subAdmins: 12 },
	{ month: "Nov", residents: 1350, guards: 62, subAdmins: 13 },
	{ month: "Dec", residents: 1415, guards: 65, subAdmins: 14 },
];
