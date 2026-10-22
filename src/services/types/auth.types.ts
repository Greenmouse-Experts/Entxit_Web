export interface LoginCredentials {
	email: string;
	password: string;
	deviceName?: string;
	deviceType?: "web" | "mobile" | "ios" | "android" | string;
}

export interface RegisterHostDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	hostCommunityId: string;
}

export interface RegisterSubadminDto {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	hostCommunityName: string;
	hostCommunityCategoryId: string;
	state: string;
	address: string;
	hostCommunityTypeId: string;
}

export interface ForgotPasswordDto {
	email: string;
}

export interface ResetPasswordDto {
	otpCode: string;
	newPassword: string;
	userId: string;
}

export interface VerifyEmailDto {
	otpCode: string;
	userId: string;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
}

export interface RefreshTokenDto {
	refreshToken: string;
}

export interface AuthPayload {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	isEmailVerified: boolean;
	status: string;
	roles: string[];
	access_token: string;
	refresh_token: string;
	sessionId: string;
	phone?: string;
}

export interface SessionItem {
	id: string;
	userId: string;
	deviceType?: string;
	deviceName?: string;
	ipAddress?: string;
	createdAt: string;
	expiresAt?: string;
	isCurrent?: boolean;
}
