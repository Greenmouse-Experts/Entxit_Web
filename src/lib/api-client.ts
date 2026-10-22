import axios, { type AxiosError, type AxiosInstance } from "axios";
import { clear_user, get_user_value } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.example.com";

const apiClient: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
	const token = get_user_value()?.accessToken;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			clear_user();
			if (
				typeof window !== "undefined" &&
				window.location.pathname !== "/login"
			) {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

export default apiClient;
