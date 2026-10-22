import apiClient, { refreshAccessToken } from "../lib/api-client";
import {
	clear_user,
	get_user_value,
	type ProfileData,
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

const handleAuthSuccess = (
	resData: ApiResponse<AuthPayload> | LoginResponse,
): LoginResponse => {
	const payload: Partial<AuthPayload> =
		resData.payload ?? (resData as Partial<AuthPayload>);
	const responseUser = "user" in resData ? resData.user : undefined;
	const accessToken =
		payload.access_token ??
		("accessToken" in resData ? resData.accessToken : undefined) ??
		("token" in resData ? resData.token : undefined);
	const refreshToken =
		payload.refresh_token ??
		("refreshToken" in resData ? resData.refreshToken : undefined);

	if (!accessToken) {
		throw new Error("Authentication response did not include an access token");
	}
	const id = payload.id ?? responseUser?.id;
	const email = payload.email ?? responseUser?.email;
	if (!id || !email) {
		throw new Error("Authentication response did not include user details");
	}

	const role =
		payload.roles?.[0] ??
		responseUser?.role ??
		(responseUser && "userType" in responseUser
			? responseUser.userType
			: undefined) ??
		"admin";
	const userObj: UserData = {
		...responseUser,
		id,
		email,
		name:
			`${payload.firstName ?? responseUser?.firstName ?? ""} ${payload.lastName ?? responseUser?.lastName ?? ""}`.trim() ||
			responseUser?.name ||
			email,
		firstName: payload.firstName ?? responseUser?.firstName,
		lastName: payload.lastName ?? responseUser?.lastName,
		phoneNumber:
			payload.phone ??
			(responseUser && "phoneNumber" in responseUser
				? responseUser.phoneNumber
				: undefined),
		userType: role,
		role,
		permissions: payload.roles ??
			(responseUser && "permissions" in responseUser
				? responseUser.permissions
				: undefined) ?? [role],
		isOnboarded:
			responseUser && "isOnboarded" in responseUser
				? responseUser.isOnboarded
				: true,
	};

	set_user_value({
		accessToken,
		refreshToken,
		user: userObj,
	});
	const profile = "profile" in resData ? resData.profile : undefined;
	set_profile_value(profile ?? userObj);

	return {
		token: accessToken,
		accessToken,
		refreshToken,
		user: userObj,
		profile,
		payload: resData.payload,
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
	): Promise<{ token: string; refreshToken?: string }> =>
		refreshAccessToken(token),

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
