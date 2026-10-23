import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	CommunitySubscription,
	CreateSubscriptionPlanDto,
	SubscriptionHistoryItem,
	SubscriptionPlan,
	UpdateSubscriptionPlanDto,
} from "./types";

export const subscriptionService = {
	// ==========================================
	// ADMIN SUBSCRIPTION PLANS (CRUD)
	// ==========================================
	getPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
		const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
			"/admins/subscription-plans",
		);
		return data;
	},

	createPlan: async (
		dto: CreateSubscriptionPlanDto,
	): Promise<ApiResponse<SubscriptionPlan>> => {
		const { data } = await apiClient.post<ApiResponse<SubscriptionPlan>>(
			"/admins/subscription-plans",
			dto,
		);
		return data;
	},

	updatePlan: async (
		id: string,
		dto: UpdateSubscriptionPlanDto,
	): Promise<ApiResponse<SubscriptionPlan>> => {
		const { data } = await apiClient.patch<ApiResponse<SubscriptionPlan>>(
			`/admins/subscription-plans/${id}`,
			dto,
		);
		return data;
	},

	deletePlan: async (id: string): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/subscription-plans/${id}`,
		);
		return data;
	},

	// ==========================================
	// ADMIN SUBSCRIPTION ACTIONS
	// ==========================================
	suspendSubscription: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/subscriptions/${communityId}/suspend`,
		);
		return data;
	},

	reactivateSubscription: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/subscriptions/${communityId}/reactivate`,
		);
		return data;
	},

	expireSubscription: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/subscriptions/${communityId}/expire`,
		);
		return data;
	},

	// ==========================================
	// SUBADMIN SUBSCRIPTIONS
	// ==========================================
	getSubadminPlans: async (): Promise<
		ApiResponse<SubscriptionPlan[] | { data: SubscriptionPlan[] }>
	> => {
		const { data } = await apiClient.get<
			ApiResponse<SubscriptionPlan[] | { data: SubscriptionPlan[] }>
		>("/subadmin/subscription-plans");
		return data;
	},

	getCommunitySubscription: async (
		communityId: string,
	): Promise<
		ApiResponse<
			| CommunitySubscription
			| { data: CommunitySubscription | null }
			| { subscription: CommunitySubscription | null }
			| null
		>
	> => {
		const { data } = await apiClient.get<
			ApiResponse<
				| CommunitySubscription
				| { data: CommunitySubscription | null }
				| { subscription: CommunitySubscription | null }
				| null
			>
		>(`/subadmin/subscription/${communityId}`);
		return data;
	},

	getCommunitySubscriptionHistory: async (
		communityId: string,
	): Promise<
		ApiResponse<SubscriptionHistoryItem[] | { data: SubscriptionHistoryItem[] }>
	> => {
		const { data } = await apiClient.get<
			ApiResponse<
				SubscriptionHistoryItem[] | { data: SubscriptionHistoryItem[] }
			>
		>(`/subadmin/subscription/history/${communityId}`);
		return data;
	},
};

export default subscriptionService;
