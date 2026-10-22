// @vitest-environment jsdom
// @vitest-environment-options {"url":"http://localhost/login"}
import axios from "axios";
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

beforeEach(() => {
	vi.resetModules();
	vi.restoreAllMocks();
	localStorage.clear();
	window.history.replaceState({}, "", "/login");
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
				throw new axios.AxiosError(
					"Unauthorized",
					"ERR_BAD_REQUEST",
					config,
					undefined,
					{
						data: {},
						status: 401,
						statusText: "Unauthorized",
						headers: {},
						config,
					},
				);
			},
		});

		await expect(request).rejects.toMatchObject({ response: { status: 401 } });
		expect(store.get_user_value()).toBeNull();
		expect(localStorage.getItem("user")).toBeNull();
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
