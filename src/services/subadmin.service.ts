import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	CommunityDue,
	CreateCommunityDueDto,
	CreateHostCommunityDto,
	CreateWithdrawalAccountDto,
	DueInstance,
	InviteSecurityGuardDto,
	KycSubmission,
	LinkPayoutAccountDto,
	PaginatedResponse,
	PaginationParams,
	PayoutAccount,
	SecurityGuard,
	SpecificDatesScheduleDto,
	SubadminCommunity,
	UpdateCommunityDto,
	UpdateCommunityDueDto,
	UpdateWithdrawalAccountDto,
	WeeklyScheduleDto,
	WithdrawalAccount,
	WithdrawalPinDto,
	WithdrawDto,
} from "./types";

export const subadminService = {
	// ==========================================
	// HOST COMMUNITIES
	// ==========================================
	createHostCommunity: async (
		dto: CreateHostCommunityDto,
	): Promise<ApiResponse<SubadminCommunity>> => {
		const { data } = await apiClient.post<ApiResponse<SubadminCommunity>>(
			"/subadmin/host-communities",
			dto,
		);
		return data;
	},

	getManagedCommunities: async (): Promise<
		ApiResponse<{ data: SubadminCommunity[] }>
	> => {
		const { data } = await apiClient.get<
			ApiResponse<{ data: SubadminCommunity[] }>
		>("/subadmin/communities");
		return data;
	},

	updateManagedCommunity: async (
		communityId: string,
		dto: UpdateCommunityDto,
	): Promise<ApiResponse<SubadminCommunity>> => {
		const { data } = await apiClient.patch<ApiResponse<SubadminCommunity>>(
			`/subadmin/communities/${communityId}`,
			dto,
		);
		return data;
	},

	deactivateHost: async (
		communityId: string,
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/subadmin/communities/${communityId}/hosts/${userId}/deactivate`,
		);
		return data;
	},

	reactivateHost: async (
		communityId: string,
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
			`/subadmin/communities/${communityId}/hosts/${userId}/reactivate`,
		);
		return data;
	},

	// ==========================================
	// KYC
	// ==========================================
	getPendingKyc: async (
		communityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<KycSubmission>> => {
		const { data } = await apiClient.get<PaginatedResponse<KycSubmission>>(
			`/subadmin/kyc/pending/${communityId}`,
			{ params },
		);
		return data;
	},

	acceptKyc: async (
		communityId: string,
		userId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/subadmin/kyc/accept/${communityId}`,
			{ userId },
		);
		return data;
	},

	rejectKyc: async (
		communityId: string,
		userId: string,
		rejectionReason: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/subadmin/kyc/reject/${communityId}`,
			{ userId, rejectionReason },
		);
		return data;
	},

	// ==========================================
	// SECURITY GUARDS & SCHEDULES
	// ==========================================
	getGuards: async (
		communityId?: string,
	): Promise<ApiResponse<SecurityGuard[]>> => {
		const { data } = await apiClient.get<ApiResponse<SecurityGuard[]>>(
			"/subadmin/security-guards",
			{ params: communityId ? { communityId } : undefined },
		);
		return data;
	},

	inviteGuard: async (
		dto: InviteSecurityGuardDto,
	): Promise<ApiResponse<SecurityGuard>> => {
		const { data } = await apiClient.post<ApiResponse<SecurityGuard>>(
			"/subadmin/security-guards",
			dto,
		);
		return data;
	},

	removeGuard: async (
		userId: string,
		communityId?: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/subadmin/security-guards/${userId}`,
			{ params: communityId ? { communityId } : undefined },
		);
		return data;
	},

	getGuardSchedule: async (
		userId: string,
		communityId?: string,
	): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			`/subadmin/security-guards/schedule/${userId}`,
			{ params: communityId ? { communityId } : undefined },
		);
		return data;
	},

	setWeeklySchedule: async (
		dto: WeeklyScheduleDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			"/subadmin/security-guards/schedule/weekly",
			dto,
		);
		return data;
	},

	removeWeeklyScheduleDay: async (
		userId: string,
		dayOfWeek: string,
		communityId?: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/subadmin/security-guards/schedule/weekly/${userId}/${dayOfWeek}`,
			{ params: communityId ? { communityId } : undefined },
		);
		return data;
	},

	addSpecificDatesSchedule: async (
		dto: SpecificDatesScheduleDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			"/subadmin/security-guards/schedule/specific-dates",
			dto,
		);
		return data;
	},

	removeSpecificDatesSchedule: async (
		dto: SpecificDatesScheduleDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			"/subadmin/security-guards/schedule/specific-dates",
			{ data: dto },
		);
		return data;
	},

	// ==========================================
	// DUES & LEVIES
	// ==========================================
	getCommunityDues: async (
		communityId: string,
		params?: PaginationParams & { status?: string },
	): Promise<PaginatedResponse<CommunityDue>> => {
		const { data } = await apiClient.get<PaginatedResponse<CommunityDue>>(
			`/subadmin/dues/${communityId}`,
			{ params },
		);
		return data;
	},

	createCommunityDue: async (
		communityId: string,
		dto: CreateCommunityDueDto,
	): Promise<ApiResponse<{ due: CommunityDue; message: string }>> => {
		const { data } = await apiClient.post<
			ApiResponse<{ due: CommunityDue; message: string }>
		>(`/subadmin/dues/${communityId}`, dto);
		return data;
	},

	getDueById: async (
		communityId: string,
		dueId: string,
	): Promise<ApiResponse<CommunityDue>> => {
		const { data } = await apiClient.get<ApiResponse<CommunityDue>>(
			`/subadmin/dues/${communityId}/${dueId}`,
		);
		return data;
	},

	updateDue: async (
		communityId: string,
		dueId: string,
		dto: UpdateCommunityDueDto,
	): Promise<ApiResponse<CommunityDue>> => {
		const { data } = await apiClient.put<ApiResponse<CommunityDue>>(
			`/subadmin/dues/${communityId}/${dueId}`,
			dto,
		);
		return data;
	},

	getAllDueInstances: async (
		communityId: string,
		params?: PaginationParams & { status?: string },
	): Promise<PaginatedResponse<DueInstance>> => {
		const { data } = await apiClient.get<PaginatedResponse<DueInstance>>(
			`/subadmin/dues/${communityId}/instances`,
			{ params },
		);
		return data;
	},

	getDueInstances: async (
		communityId: string,
		dueId: string,
		params?: PaginationParams & { status?: string },
	): Promise<PaginatedResponse<DueInstance>> => {
		const { data } = await apiClient.get<PaginatedResponse<DueInstance>>(
			`/subadmin/dues/${communityId}/${dueId}/instances`,
			{ params },
		);
		return data;
	},

	markDueInstanceOverdue: async (
		communityId: string,
		dueId: string,
		instanceId: string,
	): Promise<ApiResponse<DueInstance>> => {
		const { data } = await apiClient.put<ApiResponse<DueInstance>>(
			`/subadmin/dues/${communityId}/${dueId}/instances/${instanceId}/overdue`,
		);
		return data;
	},

	// ==========================================
	// WITHDRAWAL ACCOUNTS & PIN
	// ==========================================
	getWithdrawalAccounts: async (
		communityId: string,
	): Promise<ApiResponse<WithdrawalAccount[]>> => {
		const { data } = await apiClient.get<ApiResponse<WithdrawalAccount[]>>(
			`/subadmin/withdrawal-accounts/${communityId}`,
		);
		return data;
	},

	createWithdrawalAccount: async (
		communityId: string,
		dto: CreateWithdrawalAccountDto,
	): Promise<ApiResponse<WithdrawalAccount>> => {
		const { data } = await apiClient.post<ApiResponse<WithdrawalAccount>>(
			`/subadmin/withdrawal-accounts/${communityId}`,
			dto,
		);
		return data;
	},

	getDefaultWithdrawalAccount: async (
		communityId: string,
	): Promise<ApiResponse<WithdrawalAccount>> => {
		const { data } = await apiClient.get<ApiResponse<WithdrawalAccount>>(
			`/subadmin/withdrawal-accounts/${communityId}/default`,
		);
		return data;
	},

	getWithdrawalAccount: async (
		communityId: string,
		recipientId: string,
	): Promise<ApiResponse<WithdrawalAccount>> => {
		const { data } = await apiClient.get<ApiResponse<WithdrawalAccount>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}`,
		);
		return data;
	},

	updateWithdrawalAccount: async (
		communityId: string,
		recipientId: string,
		dto: UpdateWithdrawalAccountDto,
	): Promise<ApiResponse<WithdrawalAccount>> => {
		const { data } = await apiClient.put<ApiResponse<WithdrawalAccount>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}`,
			dto,
		);
		return data;
	},

	deleteWithdrawalAccount: async (
		communityId: string,
		recipientId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.delete<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}`,
		);
		return data;
	},

	setDefaultWithdrawalAccount: async (
		communityId: string,
		recipientId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.put<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}/set-default`,
		);
		return data;
	},

	deactivateWithdrawalAccount: async (
		communityId: string,
		recipientId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.put<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}/deactivate`,
		);
		return data;
	},

	withdraw: async (
		communityId: string,
		recipientId: string,
		dto: WithdrawDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/${recipientId}/withdraw`,
			dto,
		);
		return data;
	},

	setWithdrawalPin: async (
		communityId: string,
		dto: WithdrawalPinDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/withdrawal-pin/set`,
			dto,
		);
		return data;
	},

	verifyWithdrawalPin: async (
		communityId: string,
		dto: WithdrawalPinDto,
	): Promise<ApiResponse<{ success: boolean; message: string }>> => {
		const { data } = await apiClient.post<
			ApiResponse<{ success: boolean; message: string }>
		>(
			`/subadmin/withdrawal-accounts/${communityId}/withdrawal-pin/verify`,
			dto,
		);
		return data;
	},

	getWithdrawalPinStatus: async (
		communityId: string,
	): Promise<ApiResponse<{ isPinSet: boolean }>> => {
		const { data } = await apiClient.get<ApiResponse<{ isPinSet: boolean }>>(
			`/subadmin/withdrawal-accounts/${communityId}/withdrawal-pin/status`,
		);
		return data;
	},

	disableWithdrawalPin: async (
		communityId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			`/subadmin/withdrawal-accounts/${communityId}/withdrawal-pin/disable`,
		);
		return data;
	},

	// ==========================================
	// PAYOUT ACCOUNTS
	// ==========================================
	getPayoutAccount: async (
		communityId: string,
	): Promise<ApiResponse<PayoutAccount>> => {
		const { data } = await apiClient.get<ApiResponse<PayoutAccount>>(
			`/subadmin/payout-accounts/${communityId}`,
		);
		return data;
	},

	linkPayoutAccount: async (
		communityId: string,
		dto: LinkPayoutAccountDto,
	): Promise<ApiResponse<PayoutAccount>> => {
		const { data } = await apiClient.post<ApiResponse<PayoutAccount>>(
			`/subadmin/payout-accounts/${communityId}`,
			dto,
		);
		return data;
	},

	changePayoutAccount: async (
		communityId: string,
		dto: LinkPayoutAccountDto,
	): Promise<ApiResponse<PayoutAccount>> => {
		const { data } = await apiClient.put<ApiResponse<PayoutAccount>>(
			`/subadmin/payout-accounts/${communityId}`,
			dto,
		);
		return data;
	},

	// ==========================================
	// SUBADMIN ANALYTICS
	// ==========================================
	getCommunityOverview: async (
		communityId: string,
	): Promise<ApiResponse<any>> => {
		const { data } = await apiClient.get<ApiResponse<any>>(
			`/subadmin/analytics/${communityId}/overview`,
		);
		return data;
	},

	getVisitorTimeline: async (
		communityId: string,
		params?: PaginationParams & { startDate?: string; endDate?: string },
	): Promise<PaginatedResponse<any>> => {
		const { data } = await apiClient.get<PaginatedResponse<any>>(
			`/subadmin/analytics/${communityId}/visitors/timeline`,
			{ params },
		);
		return data;
	},

	getOutstandingLevies: async (
		communityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<any>> => {
		const { data } = await apiClient.get<PaginatedResponse<any>>(
			`/subadmin/analytics/${communityId}/levies/outstanding`,
			{ params },
		);
		return data;
	},
};

export default subadminService;
