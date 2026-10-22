import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	CheckInGuestDto,
	CheckOutGuestDto,
	CreateSecurityAlertDto,
	GuestStatusResponse,
	GuestVerificationResult,
	PaginatedResponse,
	SecurityAnalyticsOverview,
	SecurityGuardSchedule,
	SecurityTimelineResponse,
	SecurityWorkingStatus,
	VerifyDigitCodeDto,
	VerifyQrCodeDto,
	VisitorLog,
	VisitorLogsFilterParams,
} from "./types";

export const securityService = {
	/**
	 * Verify guest invitation by 6-digit code
	 */
	verifyDigitCode: async (
		dto: VerifyDigitCodeDto,
	): Promise<ApiResponse<GuestVerificationResult>> => {
		const { data } = await apiClient.post<ApiResponse<GuestVerificationResult>>(
			"/security/verify/digit-code",
			dto,
		);
		return data;
	},

	/**
	 * Verify guest invitation by QR code data
	 */
	verifyQrCode: async (
		dto: VerifyQrCodeDto,
	): Promise<ApiResponse<GuestVerificationResult>> => {
		const { data } = await apiClient.post<ApiResponse<GuestVerificationResult>>(
			"/security/verify/qr-code",
			dto,
		);
		return data;
	},

	/**
	 * Check in a verified guest
	 */
	checkIn: async (
		dto: CheckInGuestDto,
	): Promise<ApiResponse<{ message: string; checkInTime: string }>> => {
		const { data } = await apiClient.post<
			ApiResponse<{ message: string; checkInTime: string }>
		>("/security/check-in", dto);
		return data;
	},

	/**
	 * Check out a guest
	 */
	checkOut: async (
		dto: CheckOutGuestDto,
	): Promise<ApiResponse<{ message: string; checkOutTime: string }>> => {
		const { data } = await apiClient.post<
			ApiResponse<{ message: string; checkOutTime: string }>
		>("/security/check-out", dto);
		return data;
	},

	/**
	 * Get guest invitation status
	 */
	getGuestStatus: async (params: {
		invitationId: string;
		communityId: string;
	}): Promise<ApiResponse<GuestStatusResponse>> => {
		const { data } = await apiClient.get<ApiResponse<GuestStatusResponse>>(
			"/security/guest-status",
			{ params },
		);
		return data;
	},

	/**
	 * Get visitor entry and exit logs with filtering
	 */
	getVisitorLogs: async (
		params?: VisitorLogsFilterParams,
	): Promise<PaginatedResponse<VisitorLog>> => {
		const { data } = await apiClient.get<PaginatedResponse<VisitorLog>>(
			"/security/visitor-logs",
			{ params },
		);
		return data;
	},

	/**
	 * Get visitor analytics overview for guard
	 */
	getOverviewAnalytics: async (
		communityId?: string,
	): Promise<ApiResponse<SecurityAnalyticsOverview>> => {
		const { data } = await apiClient.get<
			ApiResponse<SecurityAnalyticsOverview>
		>("/security/analytics/overview", {
			params: communityId ? { communityId } : undefined,
		});
		return data;
	},

	/**
	 * Get visitor activity timeline
	 */
	getTimelineAnalytics: async (params?: {
		communityId?: string;
		startDate?: string;
		endDate?: string;
	}): Promise<ApiResponse<SecurityTimelineResponse>> => {
		const { data } = await apiClient.get<ApiResponse<SecurityTimelineResponse>>(
			"/security/analytics/timeline",
			{ params },
		);
		return data;
	},

	/**
	 * Get current week schedule for the logged-in security guard
	 */
	getMySchedule: async (): Promise<ApiResponse<SecurityGuardSchedule>> => {
		const { data } = await apiClient.get<ApiResponse<SecurityGuardSchedule>>(
			"/security/my-schedule",
		);
		return data;
	},

	/**
	 * Check if current guard is scheduled/working today
	 */
	getWorkingStatus: async (): Promise<ApiResponse<SecurityWorkingStatus>> => {
		const { data } = await apiClient.get<ApiResponse<SecurityWorkingStatus>>(
			"/security/working-status",
		);
		return data;
	},

	/**
	 * Create a security alert for the community
	 */
	createAlert: async (
		communityId: string,
		dto: CreateSecurityAlertDto,
	): Promise<
		ApiResponse<{ id: string; success: boolean; message: string }>
	> => {
		const { data } = await apiClient.post<
			ApiResponse<{ id: string; success: boolean; message: string }>
		>(`/security/alerts/${communityId}`, dto);
		return data;
	},

	/**
	 * Delete a security alert
	 */
	deleteAlert: async (
		alertId: string,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.delete<
			ApiResponse<{ success: boolean; message: string }>
		>(`/security/alerts/${alertId}`);
		return data;
	},
};

export default securityService;
