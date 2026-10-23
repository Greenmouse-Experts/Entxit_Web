import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import {
	type AuthUser,
	clear_user,
	get_user_value,
	set_user_value,
} from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

const apiClient: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	timeout: 30000,
});

type RetryConfig = InternalAxiosRequestConfig & { _authRetry?: boolean };
type RefreshPayload = {
	access_token?: string;
	accessToken?: string;
	token?: string;
	refresh_token?: string;
	refreshToken?: string;
};
type RefreshResponse = RefreshPayload & { payload?: RefreshPayload };

const publicAuthPaths = new Set([
	"/auth/login",
	"/auth/login-admin",
	"/auth/refresh",
	"/auth/register",
	"/auth/register/subadmin",
	"/auth/forgot-password",
	"/auth/reset-password",
	"/auth/verify-email",
	"/auth/resend-verification",
	"/users/host-categories",
	"/users/host-community-types",
]);

const isPublicAuthRequest = (url?: string) =>
	publicAuthPaths.has(url?.split("?")[0] ?? "");

function clearExpiredSession(session: AuthUser) {
	const current = get_user_value();
	if (
		!current ||
		current.accessToken !== session.accessToken ||
		current.refreshToken !== session.refreshToken
	)
		return;

	clear_user();
	if (
		typeof window !== "undefined" &&
		window.location.pathname !== "/auth/login"
	) {
		window.location.href = "/auth/login";
	}
}

let refreshPromise: Promise<{ token: string; refreshToken?: string }> | null =
	null;

export function refreshAccessToken(refreshTokenOverride?: string) {
	if (refreshPromise) return refreshPromise;

	const session = get_user_value();
	const refreshToken = refreshTokenOverride ?? session?.refreshToken;
	if (!session || !refreshToken) {
		return Promise.reject(new Error("No refresh token is available"));
	}

	refreshPromise = (async () => {
		try {
			const { data } = await apiClient.post<RefreshResponse>("/auth/refresh", {
				refreshToken,
			});
			const payload = data.payload ?? data;
			const token =
				payload.access_token ?? payload.accessToken ?? payload.token;
			if (!token)
				throw new Error("Refresh response did not include an access token");

			const current = get_user_value();
			if (!current || current.refreshToken !== session.refreshToken) {
				throw new Error("Session changed during token refresh");
			}

			const nextRefreshToken =
				payload.refresh_token ?? payload.refreshToken ?? current.refreshToken;
			set_user_value({
				...current,
				accessToken: token,
				refreshToken: nextRefreshToken,
			});
			return { token, refreshToken: nextRefreshToken };
		} catch (error) {
			const status = axios.isAxiosError(error)
				? error.response?.status
				: undefined;
			if (
				(!refreshTokenOverride ||
					refreshTokenOverride === session.refreshToken) &&
				(status === 401 || status === 403)
			) {
				clearExpiredSession(session);
			}
			throw error;
		} finally {
			refreshPromise = null;
		}
	})();
	return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
	if (isPublicAuthRequest(config.url)) {
		config.headers.delete("Authorization");
		return config;
	}

	const token = get_user_value()?.accessToken;
	if (token) config.headers.set("Authorization", `Bearer ${token}`);
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const config = error.config as RetryConfig | undefined;
		if (
			error.response?.status !== 401 ||
			!config ||
			isPublicAuthRequest(config.url)
		) {
			return Promise.reject(error);
		}

		const session = get_user_value();
		if (!session) return Promise.reject(error);
		if (config._authRetry) {
			clearExpiredSession(session);
			return Promise.reject(error);
		}
		if (!session.refreshToken) {
			clearExpiredSession(session);
			return Promise.reject(error);
		}

		config._authRetry = true;
		try {
			const sentToken = config.headers.get("Authorization");
			const token =
				sentToken !== `Bearer ${session.accessToken}`
					? session.accessToken
					: (await refreshAccessToken()).token;
			config.headers.set("Authorization", `Bearer ${token}`);
			return apiClient.request(config);
		} catch (refreshError) {
			const status = axios.isAxiosError(refreshError)
				? refreshError.response?.status
				: undefined;
			if (status === 401 || status === 403) {
				clearExpiredSession(session);
			}
			return Promise.reject(refreshError);
		}
	},
);

export default apiClient;
