import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	DueReceipt,
	HostCategory,
	HostCommunitySummary,
	HostCommunityType,
	KycDocument,
	KycDocumentType,
	KycStatusResponse,
	PaginatedResponse,
	PaginationParams,
	PresignedUrlResponse,
	SubmitKycDocumentDto,
	SubmitKycVerificationDto,
	UserDueInstance,
} from "./types";

export const usersService = {
	/**
	 * Get all host categories
	 */
	getHostCategories: async (): Promise<ApiResponse<HostCategory[]>> => {
		const { data } = await apiClient.get<ApiResponse<HostCategory[]>>(
			"/users/host-categories",
		);
		return data;
	},

	/**
	 * Get all host community types
	 */
	getHostCommunityTypes: async (): Promise<
		ApiResponse<HostCommunityType[]>
	> => {
		const { data } = await apiClient.get<ApiResponse<HostCommunityType[]>>(
			"/users/host-community-types",
		);
		return data;
	},

	/**
	 * Get all host communities with optional category filter
	 */
	getHostCommunities: async (
		params?: PaginationParams & { categoryId?: string },
	): Promise<PaginatedResponse<HostCommunitySummary>> => {
		const { data } = await apiClient.get<
			PaginatedResponse<HostCommunitySummary>
		>("/users/host-communities", { params });
		return data;
	},

	// ==========================================
	// KYC DOCUMENTS & VERIFICATION
	// ==========================================
	/**
	 * Generate KYC document upload presigned URL
	 */
	getKycPresignedUrl: async (): Promise<ApiResponse<PresignedUrlResponse>> => {
		const { data } = await apiClient.get<ApiResponse<PresignedUrlResponse>>(
			"/users/kyc-document/presigned-url",
		);
		return data;
	},

	/**
	 * Submit KYC document to host community for verification
	 */
	submitKycVerification: async (
		dto: SubmitKycVerificationDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
			"/users/kyc-document/submit-verification",
			dto,
		);
		return data;
	},

	/**
	 * Get KYC document types
	 */
	getKycDocumentTypes: async (): Promise<ApiResponse<KycDocumentType[]>> => {
		const { data } = await apiClient.get<ApiResponse<KycDocumentType[]>>(
			"/users/kyc-document/types",
		);
		return data;
	},

	/**
	 * Submit new KYC document
	 */
	submitKycDocument: async (
		dto: SubmitKycDocumentDto,
	): Promise<ApiResponse<KycDocument>> => {
		const { data } = await apiClient.post<ApiResponse<KycDocument>>(
			"/users/kyc-document",
			dto,
		);
		return data;
	},

	/**
	 * Update existing KYC document
	 */
	updateKycDocument: async (
		dto: SubmitKycDocumentDto,
	): Promise<ApiResponse<KycDocument>> => {
		const { data } = await apiClient.put<ApiResponse<KycDocument>>(
			"/users/kyc-document",
			dto,
		);
		return data;
	},

	/**
	 * Get KYC document by authenticated user ID
	 */
	getKycDocument: async (): Promise<ApiResponse<KycDocument>> => {
		const { data } = await apiClient.get<ApiResponse<KycDocument>>(
			"/users/kyc-document",
		);
		return data;
	},

	/**
	 * Get KYC status for a specific host community
	 */
	getKycStatus: async (
		hostCommunityId: string,
	): Promise<ApiResponse<KycStatusResponse>> => {
		const { data } = await apiClient.get<ApiResponse<KycStatusResponse>>(
			`/users/kyc-status/${hostCommunityId}`,
		);
		return data;
	},

	// ==========================================
	// DUES & RECEIPTS
	// ==========================================
	/**
	 * Get due instances for a specific host community
	 */
	getDueInstancesForCommunity: async (
		hostCommunityId: string,
		params?: PaginationParams,
	): Promise<PaginatedResponse<UserDueInstance>> => {
		const { data } = await apiClient.get<PaginatedResponse<UserDueInstance>>(
			`/users/dues/${hostCommunityId}`,
			{ params },
		);
		return data;
	},

	/**
	 * Get due instances with details for host's communities
	 */
	getDuesHistory: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<UserDueInstance>> => {
		const { data } = await apiClient.get<PaginatedResponse<UserDueInstance>>(
			"/users/dues",
			{ params },
		);
		return data;
	},

	/**
	 * Get confirmed dues receipt history
	 */
	getReceiptsHistory: async (
		params?: PaginationParams,
	): Promise<PaginatedResponse<DueReceipt>> => {
		const { data } = await apiClient.get<PaginatedResponse<DueReceipt>>(
			"/users/dues/receipts",
			{ params },
		);
		return data;
	},

	/**
	 * Download your own confirmed dues receipt PDF
	 */
	downloadReceiptPdf: async (reference: string): Promise<Blob> => {
		const { data } = await apiClient.get(
			`/users/dues/receipts/${reference}.pdf`,
			{
				responseType: "blob",
			},
		);
		return data;
	},
};

export default usersService;
