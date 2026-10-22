import apiClient from "../lib/api-client";
import type {
	ApiResponse,
	Bank,
	CommunityBalanceResponse,
	InitiatePaymentResponse,
	PaymentHistoryItem,
	PaymentStatusResponse,
	PaystackAccountBalanceResponse,
	ValidateAccountDto,
	ValidatedAccountResponse,
} from "./types";

export const paymentsService = {
	/**
	 * Initiate payment for a specific due instance
	 */
	initiateDuePayment: async (
		dueInstanceId: string,
		payload?: { email?: string },
	): Promise<ApiResponse<InitiatePaymentResponse>> => {
		const { data } = await apiClient.post<ApiResponse<InitiatePaymentResponse>>(
			`/payments/dues/${dueInstanceId}`,
			payload ?? {},
		);
		return data;
	},

	/**
	 * Initiate subscription payment for community
	 */
	initiateSubscriptionPayment: async (
		communityId: string,
		payload?: { email?: string },
	): Promise<ApiResponse<InitiatePaymentResponse>> => {
		const { data } = await apiClient.post<ApiResponse<InitiatePaymentResponse>>(
			`/payments/subscription/${communityId}`,
			payload ?? {},
		);
		return data;
	},

	/**
	 * Check payment status by transaction reference
	 */
	getPaymentStatus: async (
		reference: string,
	): Promise<ApiResponse<PaymentStatusResponse>> => {
		const { data } = await apiClient.get<ApiResponse<PaymentStatusResponse>>(
			`/payments/status/${reference}`,
		);
		return data;
	},

	/**
	 * Get community payment balance
	 */
	getCommunityBalance: async (
		communityId: string,
	): Promise<ApiResponse<CommunityBalanceResponse>> => {
		const { data } = await apiClient.get<ApiResponse<CommunityBalanceResponse>>(
			`/payments/balance/${communityId}`,
		);
		return data;
	},

	/**
	 * Get Paystack account balance (Super Admin only)
	 */
	getPaystackBalance: async (): Promise<
		ApiResponse<PaystackAccountBalanceResponse>
	> => {
		const { data } = await apiClient.get<
			ApiResponse<PaystackAccountBalanceResponse>
		>("/payments/account/balance");
		return data;
	},

	/**
	 * Get payment history for a specific due
	 */
	getPaymentHistory: async (
		dueId: string,
	): Promise<ApiResponse<PaymentHistoryItem[]>> => {
		const { data } = await apiClient.get<ApiResponse<PaymentHistoryItem[]>>(
			`/payments/history/${dueId}`,
		);
		return data;
	},

	/**
	 * List available banks for transfers/payouts
	 */
	getBanks: async (): Promise<ApiResponse<Bank[]>> => {
		const { data } =
			await apiClient.get<ApiResponse<Bank[]>>("/payments/banks");
		return data;
	},

	/**
	 * Validate bank account number with bank code
	 */
	validateAccount: async (
		dto: ValidateAccountDto,
	): Promise<ApiResponse<ValidatedAccountResponse>> => {
		const { data } = await apiClient.post<
			ApiResponse<ValidatedAccountResponse>
		>("/payments/validate-account", dto);
		return data;
	},
};

export default paymentsService;
