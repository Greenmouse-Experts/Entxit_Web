// @vitest-environment jsdom
// @vitest-environment-options {"url":"http://localhost/login"}
import axios, { type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

const values = new Map<string, string>();
const storage = {
	getItem: (key: string) => values.get(key) ?? null,
	setItem: (key: string, value: string) => {
		values.set(key, value);
	},
	removeItem: (key: string) => {
		values.delete(key);
	},
	clear: () => {
		values.clear();
	},
	key: (index: number) => [...values.keys()][index] ?? null,
	get length() {
		return values.size;
	},
} as Storage;

Object.defineProperty(window, "localStorage", {
	configurable: true,
	value: storage,
});

const legacyUser = {
	id: "u-1",
	email: "admin@example.com",
	name: "Admin User",
	role: "admin",
};

const unauthorized = (config: InternalAxiosRequestConfig) =>
	new axios.AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, undefined, {
		data: {},
		status: 401,
		statusText: "Unauthorized",
		headers: {},
		config,
	});

beforeEach(() => {
	vi.resetModules();
	vi.restoreAllMocks();
	localStorage.clear();
	window.history.replaceState({}, "", "/auth/login");
});

describe("shared authentication state", () => {
	it("migrates a legacy token and user into one session", async () => {
		localStorage.setItem("auth_token", "legacy-token");
		localStorage.setItem("user", JSON.stringify(legacyUser));

		const store = await import("../store/authStore");
		expect(store.get_user_value()).toMatchObject({
			accessToken: "legacy-token",
			user: { id: "u-1", userType: "admin" },
		});
		expect(localStorage.getItem("auth_token")).toBeNull();
	});

	it("sends the store token and clears the session on 401", async () => {
		const store = await import("../store/authStore");
		store.set_user_value({
			accessToken: "session-token",
			user: { id: "u-1", email: "admin@example.com", userType: "admin" },
		});
		const { default: client } = await import("./api-client");

		const request = client.get("/private", {
			adapter: async (config) => {
				expect(config.headers.Authorization).toBe("Bearer session-token");
				throw unauthorized(config);
			},
		});

		await expect(request).rejects.toMatchObject({ response: { status: 401 } });
		expect(store.get_user_value()).toBeNull();
		expect(localStorage.getItem("user")).toBeNull();
	});

	it("refreshes once for concurrent 401s and retries with rotated tokens", async () => {
		const store = await import("../store/authStore");
		store.set_user_value({
			accessToken: "expired-token",
			refreshToken: "old-refresh-token",
			user: { id: "u-1", email: "admin@example.com", userType: "admin" },
		});
		const { default: client } = await import("./api-client");
		let refreshCount = 0;
		let protectedCount = 0;
		client.defaults.adapter = async (config) => {
			if (config.url === "/auth/refresh") {
				refreshCount++;
				expect(config.headers.Authorization).toBeUndefined();
				expect(JSON.parse(config.data)).toEqual({
					refreshToken: "old-refresh-token",
				});
				await new Promise((resolve) => setTimeout(resolve, 5));
				return {
					data: {
						payload: {
							access_token: "new-token",
							refresh_token: "new-refresh-token",
						},
					},
					status: 200,
					statusText: "OK",
					headers: {},
					config,
				};
			}
			protectedCount++;
			if (config.headers.Authorization === "Bearer expired-token") {
				throw unauthorized(config);
			}
			expect(config.headers.Authorization).toBe("Bearer new-token");
			return {
				data: { ok: true },
				status: 200,
				statusText: "OK",
				headers: {},
				config,
			};
		};

		const responses = await Promise.all([
			client.get("/private/one"),
			client.get("/private/two"),
		]);
		expect(responses.map((response) => response.data)).toEqual([
			{ ok: true },
			{ ok: true },
		]);
		expect(refreshCount).toBe(1);
		expect(protectedCount).toBe(4);
		expect(store.get_user_value()).toMatchObject({
			accessToken: "new-token",
			refreshToken: "new-refresh-token",
		});
	});

	it("clears the session when the refresh token is rejected", async () => {
		const store = await import("../store/authStore");
		store.set_user_value({
			accessToken: "expired-token",
			refreshToken: "invalid-refresh-token",
			user: { id: "u-1", email: "admin@example.com", userType: "admin" },
		});
		const { default: client } = await import("./api-client");
		let refreshCount = 0;
		client.defaults.adapter = async (config) => {
			if (config.url === "/auth/refresh") refreshCount++;
			throw unauthorized(config);
		};

		await expect(client.get("/private")).rejects.toMatchObject({
			response: { status: 401 },
		});
		expect(refreshCount).toBe(1);
		expect(store.get_user_value()).toBeNull();
	});

	it("does not attach the old token or clear the session on login failure", async () => {
		const store = await import("../store/authStore");
		store.set_user_value({
			accessToken: "existing-token",
			refreshToken: "existing-refresh-token",
			user: { id: "u-1", email: "admin@example.com", userType: "admin" },
		});
		const { default: client } = await import("./api-client");
		client.defaults.adapter = async (config) => {
			expect(config.url).toBe("/auth/login-admin");
			expect(config.headers.Authorization).toBeUndefined();
			throw unauthorized(config);
		};

		await expect(client.post("/auth/login-admin", {})).rejects.toMatchObject({
			response: { status: 401 },
		});
		expect(store.get_user_value()?.accessToken).toBe("existing-token");
	});

	it("stops after one retry if the refreshed token is also rejected", async () => {
		const store = await import("../store/authStore");
		store.set_user_value({
			accessToken: "expired-token",
			refreshToken: "refresh-token",
			user: { id: "u-1", email: "admin@example.com", userType: "admin" },
		});
		const { default: client } = await import("./api-client");
		let refreshCount = 0;
		let protectedCount = 0;
		client.defaults.adapter = async (config) => {
			if (config.url === "/auth/refresh") {
				refreshCount++;
				return {
					data: { payload: { access_token: "still-invalid" } },
					status: 200,
					statusText: "OK",
					headers: {},
					config,
				};
			}
			protectedCount++;
			throw unauthorized(config);
		};

		await expect(client.get("/private")).rejects.toMatchObject({
			response: { status: 401 },
		});
		expect(refreshCount).toBe(1);
		expect(protectedCount).toBe(2);
		expect(store.get_user_value()).toBeNull();
	});

	it("stores login and refresh results, then clears them on logout", async () => {
		const store = await import("../store/authStore");
		const { default: client } = await import("./api-client");
		const { authService } = await import("../services/auth.service");
		const calls: string[] = [];
		client.defaults.adapter = async (config) => {
			calls.push(config.url ?? "");
			return {
				data:
					config.url === "/auth/login-admin"
						? {
								payload: {
									id: legacyUser.id,
									email: legacyUser.email,
									firstName: "Admin",
									lastName: "User",
									roles: ["admin"],
									access_token: "login-token",
									refresh_token: "refresh-token",
								},
							}
						: { payload: { access_token: "refreshed-token" } },
				status: 200,
				statusText: "OK",
				headers: {},
				config,
			};
		};

		await authService.login({ email: legacyUser.email, password: "test" });
		expect(store.get_user_value()).toMatchObject({
			accessToken: "login-token",
			user: { id: "u-1", userType: "admin" },
		});
		await authService.refreshToken();
		expect(store.get_user_value()?.accessToken).toBe("refreshed-token");
		expect(calls).toEqual(["/auth/login-admin", "/auth/refresh"]);

		await authService.logout();
		expect(store.get_user_value()).toBeNull();
		expect(localStorage.getItem("user")).toBeNull();
	});
});
