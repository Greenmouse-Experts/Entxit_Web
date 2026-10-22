import apiClient from "../lib/api-client";
import type {
	Announcement,
	ApiResponse,
	CreateAnnouncementDto,
	PaginatedResponse,
	PaginationParams,
	UpdateAnnouncementDto,
} from "./types";

export const announcementsService = {
	/**
	 * Create an announcement for a community (SubAdmin)
	 */
	createAnnouncement: async (
		communityId: string,
		dto: CreateAnnouncementDto,
	): Promise<
		ApiResponse<{ id: string; success: boolean; message: string }>
	> => {
		const { data } = await apiClient.post<
			ApiResponse<{ id: string; success: boolean; message: string }>
		>(`/announcements/${communityId}`, dto);
		return data;
	},

	/**
	 * Update an announcement (SubAdmin)
	 */
	updateAnnouncement: async (
		announcementId: string,
		dto: UpdateAnnouncementDto,
	): Promise<ApiResponse<Announcement>> => {
		const { data } = await apiClient.put<ApiResponse<Announcement>>(
			`/announcements/${announcementId}`,
			dto,
		);
		return data;
	},

	/**
	 * Delete an announcement (SubAdmin)
	 */
	deleteAnnouncement: async (
		announcementId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/announcements/${announcementId}`,
		);
		return data;
	},

	/**
	 * Get details of a specific announcement
	 */
	getAnnouncementById: async (
		announcementId: string,
	): Promise<ApiResponse<Announcement>> => {
		const { data } = await apiClient.get<ApiResponse<Announcement>>(
			`/announcements/${announcementId}`,
		);
		return data;
	},

	/**
	 * Fetch announcements for a community (Host/SubAdmin)
	 */
	getCommunityAnnouncements: async (
		communityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<Announcement>> => {
		const { data } = await apiClient.get<PaginatedResponse<Announcement>>(
			`/announcements/community/${communityId}`,
			{ params },
		);
		return data;
	},

	/**
	 * Like an announcement (Host)
	 */
	likeAnnouncement: async (
		announcementId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.put<
			ApiResponse<{ success: boolean; message: string }>
		>(`/announcements/${announcementId}/like`);
		return data;
	},

	/**
	 * Dislike an announcement (Host)
	 */
	dislikeAnnouncement: async (
		announcementId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.put<
			ApiResponse<{ success: boolean; message: string }>
		>(`/announcements/${announcementId}/dislike`);
		return data;
	},

	/**
	 * Remove reaction from announcement (Host)
	 */
	removeReaction: async (
		announcementId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.delete<
			ApiResponse<{ success: boolean; message: string }>
		>(`/announcements/${announcementId}/reaction`);
		return data;
	},

	/**
	 * Mark announcement as read (Host)
	 */
	markAsRead: async (
		announcementId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.put<
			ApiResponse<{ success: boolean; message: string }>
		>(`/announcements/${announcementId}/read`);
		return data;
	},
};

export default announcementsService;
