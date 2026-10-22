export interface CreateHostCommunityDto {
	name: string;
	hostCategoryId: string;
	createdBy?: string;
	description?: string;
	state?: string;
	address?: string;
	hostCommunityTypeId?: string;
}

export interface UpdateCommunityDto {
	name?: string;
	description?: string;
	state?: string;
	address?: string;
}

export interface SubadminCommunity {
	id: string;
	name: string;
	hostCategoryId?: string;
	hostCategoryName?: string;
	description?: string;
	state?: string;
	address?: string;
	status?: "active" | "disabled" | "suspended" | string;
	totalMembers?: number;
	totalGuards?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface SecurityGuard {
	id: string;
	userId: string;
	communityId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address?: string;
	nin?: string;
	proofOfAddressUrl?: string;
	status?: "active" | "inactive" | string;
	createdAt?: string;
}

export interface InviteSecurityGuardDto {
	communityId: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	address?: string;
	nin?: string;
	proofOfAddressUrl?: string;
	proofOfAddressFilePath?: string;
}

export interface WeeklyScheduleDto {
	communityId: string;
	userId: string;
	daysOfWeek: Array<
		| "monday"
		| "tuesday"
		| "wednesday"
		| "thursday"
		| "friday"
		| "saturday"
		| "sunday"
		| string
	>;
}

export interface SpecificDatesScheduleDto {
	communityId: string;
	userId: string;
	dates: string[];
}

export interface CommunityDue {
	id: string;
	hostCommunityId: string;
	title: string;
	description?: string;
	amount: number;
	dueDate: string;
	isRecurring: boolean;
	recurringFrequency?: "weekly" | "monthly" | "quarterly" | "yearly" | string;
	status: "active" | "cancelled" | "archived" | string;
	createdByAdminId?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateCommunityDueDto {
	title: string;
	amount: number;
	dueDate: string;
	isRecurring?: boolean;
	recurringFrequency?: string;
	description?: string;
}

export interface UpdateCommunityDueDto extends Partial<CreateCommunityDueDto> {
	status?: string;
}

export interface DueInstance {
	id: string;
	communityDueId: string;
	hostCommunityId: string;
	dueDate: string;
	amount: number;
	status: "pending" | "paid" | "overdue" | "waived" | string;
	createdAt: string;
	updatedAt: string;
}

export interface WithdrawalAccount {
	id: string;
	communityId: string;
	recipientCode?: string;
	recipientName?: string;
	recipientEmail?: string;
	accountNumber: string;
	bankCode: string;
	bankName?: string;
	isDefault: boolean;
	isActive: boolean;
	createdAt?: string;
}

export interface CreateWithdrawalAccountDto {
	accountNumber: string;
	bankCode: string;
	recipientEmail: string;
}

export interface UpdateWithdrawalAccountDto {
	recipientName?: string;
	recipientEmail?: string;
	isDefault?: boolean;
	isActive?: boolean;
}

export interface WithdrawDto {
	amount: number;
	pin: string;
}

export interface WithdrawalPinDto {
	pin: string;
}

export interface PayoutAccount {
	id?: string;
	communityId: string;
	bankCode: string;
	accountNumber: string;
	businessName: string;
	accountName?: string;
	status?: string;
}

export interface LinkPayoutAccountDto {
	bankCode: string;
	accountNumber: string;
	businessName: string;
}
