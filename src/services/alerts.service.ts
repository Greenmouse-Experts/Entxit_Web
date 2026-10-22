import apiClient from "../lib/api-client";
import type {
	Alert,
	ApiResponse,
	CreateAlertDto,
	PaginatedResponse,
	PaginationParams,
	SecurityAlert,
} from "./types";

export const alertsService = {
	/**
	 * Create an alert for a community (Host/SubAdmin)
	 */
	createAlert: async (
		communityId: string,
		dto: CreateAlertDto,
	): Promise<
		ApiResponse<{ id: string; success: boolean; message: string }>
	> => {
		const { data } = await apiClient.post<
			ApiResponse<{ id: string; success: boolean; message: string }>
		>(`/alerts/${communityId}`, dto);
		return data;
	},

	/**
	 * Fetch alerts for a community
	 */
	getCommunityAlerts: async (
		communityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<Alert>> => {
		const { data } = await apiClient.get<PaginatedResponse<Alert>>(
			`/alerts/community/${communityId}`,
			{ params },
		);
		return data;
	},

	/**
	 * Get details of a specific alert
	 */
	getAlertById: async (alertId: string): Promise<ApiResponse<Alert>> => {
		const { data } = await apiClient.get<ApiResponse<Alert>>(
			`/alerts/${alertId}`,
		);
		return data;
	},

	/**
	 * Mark an alert as read
	 */
	markAsRead: async (
		alertId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.put<
			ApiResponse<{ success: boolean; message: string }>
		>(`/alerts/${alertId}/read`);
		return data;
	},

	/**
	 * Delete an alert (Host)
	 */
	deleteAlert: async (
		alertId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.delete<
			ApiResponse<{ success: boolean; message: string }>
		>(`/alerts/${alertId}`);
		return data;
	},

	// ==========================================
	// SECURITY ALERTS
	// ==========================================
	/**
	 * Fetch security alerts for a community
	 */
	getSecurityAlerts: async (
		communityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<SecurityAlert>> => {
		const { data } = await apiClient.get<PaginatedResponse<SecurityAlert>>(
			`/alerts/security/community/${communityId}`,
			{ params },
		);
		return data;
	},

	/**
	 * Get details of a specific security alert
	 */
	getSecurityAlertById: async (
		alertId: string,
	): Promise<ApiResponse<SecurityAlert>> => {
		const { data } = await apiClient.get<ApiResponse<SecurityAlert>>(
			`/alerts/security/${alertId}`,
		);
		return data;
	},

	/**
	 * Mark a security alert as read
	 */
	markSecurityAlertAsRead: async (
		alertId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.put<
			ApiResponse<{ success: boolean; message: string }>
		>(`/alerts/security/${alertId}/read`);
		return data;
	},
};

export default alertsService;
