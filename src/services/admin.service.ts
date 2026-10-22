import apiClient from "../lib/api-client";
import type {
	AdminRole,
	ApiResponse,
	BroadcastNotificationDto,
	CreateAdminDto,
	CreateRoleDto,
	ExportJob,
	HostCategory,
	HostCommunitiesStats,
	HostCommunityHost,
	HostCommunitySummary,
	HostCommunityType,
	KycDocumentType,
	KycSubmission,
	PaginatedResponse,
	PaginationParams,
	PlatformFee,
	PlatformUser,
	PlatformUserFilterParams,
	RejectKycDto,
	ResetUserPasswordDto,
	RevenueOverview,
	SuspendUserDto,
	UpdatePlatformFeeDto,
} from "./types";

export const adminService = {
	// ==========================================
	// ROLES & ADMIN ACCOUNTS
	// ==========================================
	getRoles: async (): Promise<ApiResponse<AdminRole[]>> => {
		const { data } =
			await apiClient.get<ApiResponse<AdminRole[]>>("/admins/roles");
		return data;
	},

	createRole: async (dto: CreateRoleDto): Promise<ApiResponse<AdminRole>> => {
		const { data } = await apiClient.post<ApiResponse<AdminRole>>(
			"/admins/roles",
			dto,
		);
		return data;
	},

	createAdmin: async (
		dto: CreateAdminDto,
	): Promise<ApiResponse<PlatformUser>> => {
		const { data } = await apiClient.post<ApiResponse<PlatformUser>>(
			"/admins/create",
			dto,
		);
		return data;
	},

	// ==========================================
	// PLATFORM USERS
	// ==========================================
	getUsers: async (
		params?: PlatformUserFilterParams,
	): Promise<PaginatedResponse<PlatformUser>> => {
		const { data } = await apiClient.get<PaginatedResponse<PlatformUser>>(
			"/admins/users",
			{
				params,
			},
		);
		return data;
	},

	suspendUser: async (
		userId: string,
		dto: SuspendUserDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/suspend`,
			dto,
		);
		return data;
	},

	banUser: async (
		userId: string,
		dto: SuspendUserDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/ban`,
			dto,
		);
		return data;
	},

	reactivateUser: async (
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/reactivate`,
		);
		return data;
	},

	forceLogoutUser: async (
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/force-logout`,
		);
		return data;
	},

	resetUserPassword: async (
		userId: string,
		dto: ResetUserPasswordDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/reset-password`,
			dto,
		);
		return data;
	},

	unlockUser: async (
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/admins/users/${userId}/unlock`,
		);
		return data;
	},

	// ==========================================
	// HOST COMMUNITIES
	// ==========================================
	getCommunities: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<HostCommunitySummary>> => {
		const { data } = await apiClient.get<
			PaginatedResponse<HostCommunitySummary>
		>("/admins/communities", {
			params,
		});
		return data;
	},

	getCommunityStats: async (): Promise<ApiResponse<HostCommunitiesStats>> => {
		const { data } = await apiClient.get<ApiResponse<HostCommunitiesStats>>(
			"/admins/communities/stats",
		);
		return data;
	},

	getCommunityHosts: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<HostCommunityHost>> => {
		const { data } = await apiClient.get<PaginatedResponse<HostCommunityHost>>(
			"/admins/communities/hosts",
			{
				params,
			},
		);
		return data;
	},

	enableCommunity: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/communities/${communityId}/enable`,
		);
		return data;
	},

	disableCommunity: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/communities/${communityId}/disable`,
		);
		return data;
	},

	deleteCommunity: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/communities/${communityId}`,
		);
		return data;
	},

	// ==========================================
	// COMMUNITY TYPES & CATEGORIES
	// ==========================================
	getHostCommunityTypes: async (): Promise<
		ApiResponse<HostCommunityType[]>
	> => {
		const { data } = await apiClient.get<ApiResponse<HostCommunityType[]>>(
			"/admins/host-community-types",
		);
		return data;
	},

	createHostCommunityType: async (dto: {
		name: string;
	}): Promise<ApiResponse<HostCommunityType>> => {
		const { data } = await apiClient.post<ApiResponse<HostCommunityType>>(
			"/admins/host-community-types",
			dto,
		);
		return data;
	},

	deleteHostCommunityType: async (
		id: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/host-community-types/${id}`,
		);
		return data;
	},

	createHostCategory: async (dto: {
		name: string;
	}): Promise<ApiResponse<HostCategory>> => {
		const { data } = await apiClient.post<ApiResponse<HostCategory>>(
			"/admins/host-categories",
			dto,
		);
		return data;
	},

	// ==========================================
	// KYC MANAGEMENT
	// ==========================================
	getKycSubmissions: async (
		params?: PaginationParams & { status?: string; communityId?: string },
	): Promise<PaginatedResponse<KycSubmission>> => {
		const { data } = await apiClient.get<PaginatedResponse<KycSubmission>>(
			"/admins/kyc/submissions",
			{
				params,
			},
		);
		return data;
	},

	approveKyc: async (
		userId: string,
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/kyc/${userId}/${communityId}/approve`,
		);
		return data;
	},

	rejectKyc: async (
		userId: string,
		communityId: string,
		dto: RejectKycDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/admins/kyc/${userId}/${communityId}/reject`,
			dto,
		);
		return data;
	},

	getKycDocumentTypes: async (): Promise<ApiResponse<KycDocumentType[]>> => {
		const { data } = await apiClient.get<ApiResponse<KycDocumentType[]>>(
			"/admins/kyc-document-types",
		);
		return data;
	},

	createKycDocumentType: async (dto: {
		name: string;
	}): Promise<ApiResponse<KycDocumentType>> => {
		const { data } = await apiClient.post<ApiResponse<KycDocumentType>>(
			"/admins/kyc-document-types",
			dto,
		);
		return data;
	},

	deleteKycDocumentType: async (
		id: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/kyc-document-types/${id}`,
		);
		return data;
	},

	// ==========================================
	// PAYMENTS & WITHDRAWALS LISTINGS
	// ==========================================
	getPayments: async (
		params?: PaginationParams & {
			status?: string;
			communityId?: string;
			planId?: string;
		},
	): Promise<PaginatedResponse<any>> => {
		const { data } = await apiClient.get<PaginatedResponse<any>>(
			"/admins/payments",
			{ params },
		);
		return data;
	},

	getWithdrawals: async (
		params?: PaginationParams & { status?: string; communityId?: string },
	): Promise<PaginatedResponse<any>> => {
		const { data } = await apiClient.get<PaginatedResponse<any>>(
			"/admins/withdrawals",
			{ params },
		);
		return data;
	},

	// ==========================================
	// PLATFORM SETTINGS & REVENUE
	// ==========================================
	getPlatformFee: async (): Promise<ApiResponse<PlatformFee>> => {
		const { data } = await apiClient.get<ApiResponse<PlatformFee>>(
			"/admins/settings/platform-fee",
		);
		return data;
	},

	updatePlatformFee: async (
		dto: UpdatePlatformFeeDto,
	): Promise<ApiResponse<PlatformFee>> => {
		const { data } = await apiClient.patch<ApiResponse<PlatformFee>>(
			"/admins/settings/platform-fee",
			dto,
		);
		return data;
	},

	getRevenueOverview: async (
		communityId?: string,
	): Promise<ApiResponse<RevenueOverview>> => {
		const { data } = await apiClient.get<ApiResponse<RevenueOverview>>(
			"/admins/revenue/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},

	getRevenuePerCommunity: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<any>> => {
		const { data } = await apiClient.get<PaginatedResponse<any>>(
			"/admins/revenue/per-community",
			{
				params,
			},
		);
		return data;
	},

	getRevenueTimeline: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/revenue/timeline",
		);
		return data;
	},

	// ==========================================
	// BROADCAST
	// ==========================================
	broadcast: async (
		dto: BroadcastNotificationDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			"/admins/broadcast",
			dto,
		);
		return data;
	},

	// ==========================================
	// SUPER ADMIN ANALYTICS
	// ==========================================
	// Visitors
	getVisitorOverview: async (
		communityId?: string,
	): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getVisitorPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/per-community",
		);
		return data;
	},
	getVisitorTimeline: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/timeline",
		);
		return data;
	},
	getVisitorUnique: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/unique",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getVisitorTotals: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/totals",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getVisitorPerCommunityGuests: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/per-community-guests",
		);
		return data;
	},
	getVisitorGuestTrend: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/visitors/guest-trend",
		);
		return data;
	},

	// Levies
	getLevyOverview: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/levies/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getLevyPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/levies/per-community",
		);
		return data;
	},
	getLevyTimeline: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/levies/timeline",
		);
		return data;
	},
	getLevyOutstanding: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/levies/outstanding",
		);
		return data;
	},

	// Announcements
	getAnnouncementOverview: async (
		communityId?: string,
	): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/announcements/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getAnnouncementPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/announcements/per-community",
		);
		return data;
	},
	getAnnouncementTimeline: async (params?: {
		communityId?: string;
		startDate?: string;
		endDate?: string;
	}): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/announcements/timeline",
			{ params },
		);
		return data;
	},
	getAnnouncementTop: async (params?: {
		communityId?: string;
		limit?: number | string;
	}): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/announcements/top",
			{ params },
		);
		return data;
	},

	// Alerts
	getAlertOverview: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/alerts/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getAlertPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/alerts/per-community",
		);
		return data;
	},
	getAlertTimeline: async (params?: {
		communityId?: string;
		startDate?: string;
		endDate?: string;
	}): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/alerts/timeline",
			{ params },
		);
		return data;
	},

	// Guards
	getGuardOverview: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/guards/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getGuardPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/guards/per-community",
		);
		return data;
	},
	getGuardTop: async (params?: {
		communityId?: string;
		limit?: number | string;
	}): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/guards/top",
			{ params },
		);
		return data;
	},

	// Hosts
	getHostOverview: async (communityId?: string): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/hosts/overview",
			{
				params: communityId ? { communityId } : undefined,
			},
		);
		return data;
	},
	getHostPerCommunity: async (): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			"/admins/analytics/hosts/per-community",
		);
		return data;
	},

	// ==========================================
	// EXPORTS
	// ==========================================
	exportReceipt: async (payload?: any): Promise<ApiResponse<ExportJob>> => {
		const { data } = await apiClient.post<ApiResponse<ExportJob>>(
			"/admins/exports/receipt",
			payload ?? {},
		);
		return data;
	},

	exportAudit: async (payload?: any): Promise<ApiResponse<ExportJob>> => {
		const { data } = await apiClient.post<ApiResponse<ExportJob>>(
			"/admins/exports/audit",
			payload ?? {},
		);
		return data;
	},

	exportGdpr: async (payload?: any): Promise<ApiResponse<ExportJob>> => {
		const { data } = await apiClient.post<ApiResponse<ExportJob>>(
			"/admins/exports/gdpr",
			payload ?? {},
		);
		return data;
	},

	pollExportJob: async (jobId: string): Promise<ApiResponse<ExportJob>> => {
		const { data } = await apiClient.get<ApiResponse<ExportJob>>(
			`/admins/exports/${jobId}`,
		);
		return data;
	},

	downloadLevyReceiptPdf: async (reference: string): Promise<Blob> => {
		const { data } = await apiClient.get(`/admins/receipts/${reference}.pdf`, {
			responseType: "blob",
		});
		return data;
	},

	// ==========================================
	// ADMIN DELETE OVERRIDES
	// ==========================================
	deleteAnnouncement: async (
		announcementId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/announcements/${announcementId}`,
		);
		return data;
	},

	deleteAlert: async (
		alertId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/alerts/${alertId}`,
		);
		return data;
	},

	deleteSecurityAlert: async (
		alertId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/admins/security-alerts/${alertId}`,
		);
		return data;
	},
};

export default adminService;
