import apiClient from "../lib/api-client";
import type { ApiResponse, RegisterDeviceTokenDto } from "./types";

export const notificationsService = {
	/**
	 * Register device token for push notifications
	 */
	registerDeviceToken: async (
		dto: RegisterDeviceTokenDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			"/notifications/device-token",
			dto,
		);
		return data;
	},

	/**
	 * Unregister device token
	 */
	unregisterDeviceToken: async (
		token: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/notifications/device-token/${encodeURIComponent(token)}`,
		);
		return data;
	},
};

export default notificationsService;
