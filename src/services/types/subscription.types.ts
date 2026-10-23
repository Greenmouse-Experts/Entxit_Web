export interface SubscriptionPlan {
	id: string;
	name: string;
	announcementAllowed: boolean;
	announcementLimit: number;
	leviesCreationAllowed: boolean;
	leviesCreationLimit: number;
	securityAlertsAllowed: boolean;
	securityAlertsLimit: number;
	price: string | number;
	numberOfHosts: number;
	numberOfSecurities: number;
	validityInDays: number;
	isFreePlan: boolean;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateSubscriptionPlanDto {
	name: string;
	announcementAllowed: boolean;
	announcementLimit: number;
	leviesCreationAllowed: boolean;
	leviesCreationLimit: number;
	securityAlertsAllowed: boolean;
	securityAlertsLimit: number;
	isFreePlan: boolean;
	price: string | number;
	numberOfHosts: number;
	numberOfSecurities: number;
	validityInDays: number;
}

export interface UpdateSubscriptionPlanDto
	extends Partial<CreateSubscriptionPlanDto> {
	isActive?: boolean;
}

export interface CommunitySubscription {
	id: string;
	communityId: string;
	communityName?: string;
	planId: string;
	planName?: string;
	status?: "active" | "suspended" | "expired" | "grace_period" | string;
	startDate: string;
	expiresAt: string;
	autoRenew?: boolean;
	amountPaid?: string | number;
}

export interface SubscriptionHistoryItem {
	id: string;
	communityId: string;
	planId: string;
	planName: string;
	amount: number | string;
	status: string;
	reference: string;
	paymentDate: string;
	validUntil: string;
}
