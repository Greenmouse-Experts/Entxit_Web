export interface VerifyDigitCodeDto {
	digitCode: string;
	communityId?: string;
}

export interface VerifyQrCodeDto {
	qrCodeData: string;
	communityId?: string;
}

export interface CheckInGuestDto {
	invitationId: string;
	communityId: string;
	vehiclePlateNumber?: string;
	vehicleType?: string;
}

export interface CheckOutGuestDto {
	invitationId: string;
	communityId: string;
}

export interface GuestVerificationResult {
	success: boolean;
	message: string;
	guest?: {
		id: string;
		guestName: string;
		hostName?: string;
		status: string;
		arrivalDate?: string;
		departureDate?: string;
		comingWithVehicle?: boolean;
		vehiclePlateNumber?: string;
	};
}

export interface GuestStatusResponse {
	id: string;
	guestName: string;
	status: "pending" | "checked_in" | "checked_out" | "expired" | string;
	arrivalDate: string;
	departureDate: string;
	comingWithVehicle: boolean;
	vehicleType?: string | null;
	vehiclePlateNumber?: string | null;
	checkedInAt?: string | null;
	checkedOutAt?: string | null;
}

export interface VisitorLog {
	id: string;
	invitationId?: string;
	guestName: string;
	hostName?: string;
	communityId: string;
	action: "check_in" | "check_out" | string;
	timestamp: string;
	vehiclePlateNumber?: string;
	vehicleType?: string;
	guardName?: string;
}

export interface VisitorLogsFilterParams {
	page?: number;
	limit?: number;
	communityId?: string;
	dateFrom?: string;
	dateTo?: string;
	action?: "check_in" | "check_out" | string;
}

export interface SecurityAnalyticsOverview {
	totalCheckIns: number;
	totalCheckOuts: number;
	currentlyCheckedIn: number;
	todayCheckIns: number;
	todayCheckOuts: number;
}

export interface SecurityTimelineResponse {
	startDate: string;
	endDate: string;
	data: Array<{
		date: string;
		checkIns: number;
		checkOuts: number;
	}>;
}

export interface SecurityGuardSchedule {
	userId: string;
	weekStart: string;
	weekEnd: string;
	schedule:
		| Array<{
				day: string;
				isWorking: boolean;
				shifts?: string[];
		  }>
		| Record<string, any>;
}

export interface SecurityWorkingStatus {
	isWorking: boolean;
	message?: string;
}

export interface CreateSecurityAlertDto {
	title: string;
	content: string;
	severity?: "low" | "medium" | "high" | "critical" | string;
}
