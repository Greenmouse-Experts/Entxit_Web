export interface InviteGuestDto {
	guestName: string;
	arrivalDate: string;
	departureDate: string;
	comingWithVehicle: boolean;
	vehicleType?: string;
	vehiclePlateNumber?: string;
	note?: string;
	phone?: string;
}

export interface GuestInvitation {
	id: string;
	guestName: string;
	hostName?: string;
	invitationCode: string;
	qrCode?: string;
	arrivalDate: string;
	departureDate: string;
	status: "pending" | "checked_in" | "checked_out" | "expired" | string;
	comingWithVehicle: boolean;
	vehicleType?: string;
	vehiclePlateNumber?: string;
	createdAt: string;
}

export interface GuestArrivalAnalytics {
	overall: {
		totalGuests: number;
		vehicleCount: number;
		footCount: number;
	};
	byDate?: Array<{
		date: string;
		vehicle: number;
		foot: number;
	}>;
	startDate?: string;
	endDate?: string;
}
