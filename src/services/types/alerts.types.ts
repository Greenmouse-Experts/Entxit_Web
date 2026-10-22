export interface Alert {
	id: string;
	hostCommunityId: string;
	hostId?: string;
	hostName?: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	isRead?: boolean;
	severity?: "low" | "medium" | "high" | "critical" | string;
}

export interface SecurityAlert {
	id: string;
	title: string;
	content: string;
	securityName?: string;
	communityId: string;
	isRead: boolean;
	createdAt: string;
	severity?: "low" | "medium" | "high" | "critical" | string;
}

export interface CreateAlertDto {
	title: string;
	content: string;
	severity?: "low" | "medium" | "high" | "critical" | string;
}
