export interface InitiatePaymentResponse {
	reference: string;
	authorizationUrl: string;
	accessCode?: string;
	amount: number;
	email: string;
	communityId: string;
}

export interface PaymentStatusResponse {
	reference: string;
	status: "success" | "failed" | "pending" | string;
	amount: number;
	email: string;
	communityId: string;
	createdAt: string;
	lastVerifiedAt?: string;
}

export interface CommunityBalanceResponse {
	communityId: string;
	totalPaymentsReceived: number;
	completedWithdrawals: number;
	pendingWithdrawals: number;
	netAvailableBalance: number;
}

export interface PaystackAccountBalanceResponse {
	balances: Array<{
		currency: string;
		balance: number;
	}>;
}

export interface Bank {
	id?: number | string;
	name: string;
	code: string;
	slug?: string;
	is_active?: boolean;
}

export interface ValidateAccountDto {
	accountNumber: string;
	bankCode: string;
}

export interface ValidatedAccountResponse {
	valid: boolean;
	accountName: string;
	accountNumber: string;
	bankCode: string;
}

export interface PaymentHistoryItem {
	id: string;
	reference: string;
	amount: number;
	status: string;
	paidAt: string;
	email?: string;
	dueId?: string;
}
