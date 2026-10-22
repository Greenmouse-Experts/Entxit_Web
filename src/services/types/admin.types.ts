import type { PaginationParams } from "./common.types";

export interface AdminRole {
	id: string;
	name: string;
	createdAt?: string;
}

export interface CreateRoleDto {
	name: string;
}

export interface CreateAdminDto {
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	password?: string;
	phone?: string;
}

export interface PlatformUserFilterParams extends PaginationParams {
	search?: string;
	role?: string;
	status?: string;
}

export interface PlatformUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	status: "active" | "suspended" | "banned" | string;
	roles: string[];
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt?: string;
}

export interface SuspendUserDto {
	status: "suspended" | "banned" | string;
	reason: string;
}

export interface ResetUserPasswordDto {
	temporaryPassword?: string;
}

export interface HostCommunitySummary {
	id?: string;
	hostCommunityName: string;
	hostCommunityCategoryName?: string;
	subscriptionPlanName?: string | null;
	subscriptionStatus?: string | null;
	expiresAt?: string | null;
	communityStatus: "active" | "disabled" | "suspended" | string;
	totalMembers: number;
	totalGuards: number;
	state?: string;
	address?: string;
	createdAt?: string;
}

export interface HostCommunitiesStats {
	totalCommunities: number;
	activeCommunities: number;
	totalMembers: number;
	totalGuards: number;
}

export interface HostCommunityHost {
	id: string;
	userId: string;
	communityId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	status: string;
	joinedAt?: string;
}

export interface HostCategory {
	id: string;
	name: string;
	createdAt?: string;
}

export interface HostCommunityType {
	id: string;
	name: string;
	createdAt?: string;
}

export interface KycDocumentType {
	id: string;
	name: string;
	createdAt?: string;
}

export interface KycSubmission {
	id: string;
	userId: string;
	communityId: string;
	userName?: string;
	userEmail?: string;
	communityName?: string;
	status: "pending" | "approved" | "rejected" | string;
	rejectionReason?: string | null;
	submittedAt?: string;
	reviewedAt?: string;
	documents?: Array<{
		type: string;
		url: string;
		status?: string;
	}>;
}

export interface RejectKycDto {
	reason: string;
}

export interface BroadcastNotificationDto {
	title: string;
	message: string;
	communityId?: string;
	targetRole?: "all" | "host" | "security" | "subadmin" | string;
}

export interface PlatformFee {
	value: string | number;
	currency?: string;
}

export interface UpdatePlatformFeeDto {
	value: string | number;
}

export interface RevenueOverview {
	totalRevenue?: number | string;
	totalPlatformFeeRevenue?: number | string;
	totalTransactions?: number;
	currency?: string;
}

export interface ExportJob {
	jobId: string;
	status: "pending" | "processing" | "completed" | "failed" | string;
	fileUrl?: string;
	downloadUrl?: string;
	createdAt?: string;
	completedAt?: string;
}
