export interface KycDocument {
	id: string;
	userId: string;
	kycDocumentTypeId: string;
	documentUrl: string;
	status: "pending" | "approved" | "rejected" | string;
	createdAt: string;
	updatedAt?: string;
}

export interface SubmitKycVerificationDto {
	hostCommunityId: string;
	documentIds?: string[];
}

export interface SubmitKycDocumentDto {
	kycDocumentTypeId: string;
	documentUrl: string;
}

export interface KycStatusResponse {
	status: "pending" | "approved" | "rejected" | "not_submitted" | string;
	hostCommunityId: string;
	submittedAt?: string;
	reviewedAt?: string;
	rejectionReason?: string | null;
}

export interface PresignedUrlResponse {
	uploadUrl: string;
	fileKey: string;
	publicUrl?: string;
}

export interface UserDueInstance {
	id: string;
	dueTitle?: string;
	amount: number;
	dueDate: string;
	status: "pending" | "paid" | "overdue" | string;
	reference?: string;
	paidAt?: string;
	hostCommunityId?: string;
}

export interface DueReceipt {
	id: string;
	reference: string;
	dueTitle?: string;
	amount: number;
	paidAt: string;
	receiptPdfUrl?: string;
}
