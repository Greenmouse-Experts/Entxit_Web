import apiClient from "../lib/api-client";
import {
	clear_user,
	get_user_value,
	type ProfileData,
	set_access_token,
	set_profile_value,
	set_user_value,
	type UserData,
} from "../store/authStore";
import type {
	ApiResponse,
	AuthPayload,
	ChangePasswordDto,
	ForgotPasswordDto,
	LoginCredentials,
	RegisterHostDto,
	RegisterSubadminDto,
	ResetPasswordDto,
	SessionItem,
	VerifyEmailDto,
} from "./types";

export type { LoginCredentials };

export interface LoginResponse {
	token?: string;
	accessToken?: string;
	refreshToken?: string;
	user:
		| UserData
		| {
				id: string;
				email: string;
				name?: string;
				firstName?: string;
				lastName?: string;
				role?: string;
				roles?: string[];
		  };
	profile?: ProfileData;
	payload?: AuthPayload;
}

const handleAuthSuccess = (resData: any): LoginResponse => {
	const payload: AuthPayload = resData.payload ?? resData;
	const accessToken =
		payload.access_token ?? resData.accessToken ?? resData.token;
	const refreshToken = payload.refresh_token ?? resData.refreshToken;

	if (!accessToken) {
		throw new Error("Authentication response did not include an access token");
	}

	const role = payload.roles?.[0] ?? "admin";
	const userObj: UserData = {
		id: payload.id,
		email: payload.email,
		name:
			`${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim() ||
			payload.email,
		firstName: payload.firstName,
		lastName: payload.lastName,
		phoneNumber: payload.phone,
		userType: role,
		role,
		permissions: payload.roles ?? [role],
		isOnboarded: true,
	};

	set_user_value({
		accessToken,
		refreshToken,
		user: userObj,
	});
	set_profile_value(userObj as ProfileData);

	return {
		token: accessToken,
		accessToken,
		refreshToken,
		user: userObj,
		payload,
	};
};

export const authService = {
	/**
	 * Login an admin user
	 */
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		const { data: response } = await apiClient.post<
			ApiResponse<AuthPayload> | LoginResponse
		>("/auth/login-admin", credentials);
		return handleAuthSuccess(response);
	},

	/**
	 * Login regular user (host, security, subadmin)
	 */
	loginUser: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		const { data: response } = await apiClient.post<
			ApiResponse<AuthPayload> | LoginResponse
		>("/auth/login", credentials);
		return handleAuthSuccess(response);
	},

	/**
	 * Register a new host user
	 */
	register: async (
		data: RegisterHostDto | unknown,
	): Promise<ApiResponse<AuthPayload>> => {
		const { data: response } = await apiClient.post<ApiResponse<AuthPayload>>(
			"/auth/register",
			data,
		);
		return response;
	},

	/**
	 * Register a new subadmin community
	 */
	registerSubadmin: async (
		data: RegisterSubadminDto,
	): Promise<ApiResponse<AuthPayload>> => {
		const { data: response } = await apiClient.post<ApiResponse<AuthPayload>>(
			"/auth/register/subadmin",
			data,
		);
		return response;
	},

	/**
	 * Resend verification email to user
	 */
	resendVerification: async (
		email: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.post<
			ApiResponse<{ message: string }>
		>("/auth/resend-verification", { email });
		return response;
	},

	/**
	 * Initiate forgot password process
	 */
	forgotPassword: async (
		email: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.post<
			ApiResponse<{ message: string }>
		>("/auth/forgot-password", { email } as ForgotPasswordDto);
		return response;
	},

	/**
	 * Reset user password with OTP code
	 */
	resetPassword: async (
		data: ResetPasswordDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.post<
			ApiResponse<{ message: string }>
		>("/auth/reset-password", data);
		return response;
	},

	/**
	 * Verify user email with OTP code
	 */
	verifyEmail: async (
		data: VerifyEmailDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.post<
			ApiResponse<{ message: string }>
		>("/auth/verify-email", data);
		return response;
	},

	/**
	 * Change password for authenticated user
	 */
	changePassword: async (
		data: ChangePasswordDto,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.post<
			ApiResponse<{ message: string }>
		>("/auth/change-password", data);
		return response;
	},

	/**
	 * Refresh access token
	 */
	refreshToken: async (
		token?: string,
	): Promise<{ token: string; refreshToken?: string }> => {
		const currentRefresh = token ?? get_user_value()?.refreshToken;
		const { data: response } = await apiClient.post<
			ApiResponse<{ access_token: string; refresh_token?: string }>
		>("/auth/refresh", { refreshToken: currentRefresh });
		const newAccessToken =
			response.payload?.access_token ?? (response as any).token;
		if (newAccessToken) set_access_token(newAccessToken);
		return {
			token: newAccessToken,
			refreshToken: response.payload?.refresh_token,
		};
	},

	/**
	 * Logout current session
	 */
	logout: async (): Promise<void> => {
		try {
			await apiClient.post("/auth/logout");
		} catch (error) {
			console.warn("Backend logout failed or was offline:", error);
		} finally {
			clear_user();
		}
	},

	/**
	 * List active sessions for authenticated user
	 */
	getSessions: async (): Promise<ApiResponse<SessionItem[]>> => {
		const { data: response } =
			await apiClient.get<ApiResponse<SessionItem[]>>("/auth/sessions");
		return response;
	},

	/**
	 * Revoke a specific session
	 */
	revokeSession: async (
		sessionId: string,
	): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } = await apiClient.delete<
			ApiResponse<{ message: string }>
		>(`/auth/sessions/${sessionId}`);
		return response;
	},

	/**
	 * Revoke all other sessions except the current one
	 */
	revokeOtherSessions: async (): Promise<ApiResponse<{ message: string }>> => {
		const { data: response } =
			await apiClient.delete<ApiResponse<{ message: string }>>(
				"/auth/sessions",
			);
		return response;
	},

	getCurrentUser: (): UserData | null => get_user_value()?.user ?? null,
	isAuthenticated: (): boolean => Boolean(get_user_value()?.accessToken),
};

export default authService;
