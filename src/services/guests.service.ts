import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	GuestArrivalAnalytics,
	GuestInvitation,
	InviteGuestDto,
	PaginatedResponse,
	PaginationParams,
} from "./types";

export const guestsService = {
	/**
	 * Invite a guest to a community (Host)
	 */
	inviteGuest: async (
		communityId: string,
		dto: InviteGuestDto,
	): Promise<ApiResponse<GuestInvitation>> => {
		const { data } = await apiClient.post<ApiResponse<GuestInvitation>>(
			`/guests/invite/${communityId}`,
			dto,
		);
		return data;
	},

	/**
	 * Get today's guests for the authenticated host
	 */
	getTodayGuests: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<GuestInvitation>> => {
		const { data } = await apiClient.get<PaginatedResponse<GuestInvitation>>(
			"/guests/today",
			{ params },
		);
		return data;
	},

	/**
	 * Get upcoming guests for the authenticated host
	 */
	getUpcomingGuests: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<GuestInvitation>> => {
		const { data } = await apiClient.get<PaginatedResponse<GuestInvitation>>(
			"/guests/upcoming",
			{ params },
		);
		return data;
	},

	/**
	 * Get past guests for the authenticated host
	 */
	getPastGuests: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<GuestInvitation>> => {
		const { data } = await apiClient.get<PaginatedResponse<GuestInvitation>>(
			"/guests/past",
			{ params },
		);
		return data;
	},

	/**
	 * Get guest arrival analytics (vehicle vs foot)
	 */
	getArrivalAnalytics: async (params?: {
		startDate?: string;
		endDate?: string;
		includeByDate?: boolean;
	}): Promise<ApiResponse<GuestArrivalAnalytics>> => {
		const { data } = await apiClient.get<ApiResponse<GuestArrivalAnalytics>>(
			"/guests/analytics/arrival",
			{ params },
		);
		return data;
	},
};

export default guestsService;
