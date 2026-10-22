export interface RegisterDeviceTokenDto {
	token: string;
	deviceType?: "web" | "ios" | "android" | string;
}
