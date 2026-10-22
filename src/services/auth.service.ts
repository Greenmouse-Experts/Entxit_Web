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

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	token?: string;
	accessToken?: string;
	refreshToken?: string;
	user:
		| UserData
		| {
				id: string;
				email: string;
				name: string;
				role: string;
		  };
	profile?: ProfileData;
}

export const authService = {
	login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
		const { data: response } = await apiClient.post<LoginResponse>(
			"/auth/login-admin",
			credentials,
		);
		const accessToken = response.accessToken ?? response.token;
		if (!accessToken)
			throw new Error("Login response did not include an access token");

		const user = response.user as UserData & { role?: string };
		set_user_value({
			accessToken,
			refreshToken: response.refreshToken,
			user: { ...user, userType: user.userType ?? user.role ?? "admin" },
			profile: response.profile,
		});
		set_profile_value(response.profile ?? null);
		return response;
	},

	logout: () => clear_user(),
	getCurrentUser: (): UserData | null => get_user_value()?.user ?? null,
	isAuthenticated: (): boolean => Boolean(get_user_value()?.accessToken),
	register: async (data: unknown): Promise<LoginResponse> =>
		(await apiClient.post<LoginResponse>("/auth/register", data)).data,
	forgotPassword: async (email: string): Promise<{ message: string }> =>
		(
			await apiClient.post<{ message: string }>("/auth/forgot-password", {
				email,
			})
		).data,
	resetPassword: async (
		token: string,
		password: string,
	): Promise<{ message: string }> =>
		(
			await apiClient.post<{ message: string }>("/auth/reset-password", {
				token,
				password,
			})
		).data,
	verifyEmail: async (token: string): Promise<{ message: string }> =>
		(await apiClient.post<{ message: string }>("/auth/verify-email", { token }))
			.data,
	refreshToken: async (): Promise<{ token: string }> => {
		const { data: response } = await apiClient.post<{ token: string }>(
			"/auth/refresh-token",
		);
		if (response.token) set_access_token(response.token);
		return response;
	},
};
