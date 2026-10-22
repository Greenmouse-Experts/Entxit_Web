import { useAtom } from "jotai/react";
import { atomWithStorage } from "jotai/utils";
import { getDefaultStore } from "jotai/vanilla";

export interface UserData {
	name?: string;
	role?: string;
	id: string;
	email: string;
	companyName?: string;
	isOnboarded?: boolean;
	userType: string;
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	profilePic?: string | null;
	companyId?: string;
	permissions?: string[];
}

export interface ProfileData extends UserData {
	sub?: string;
	iat?: number;
	exp?: number;
}

export interface AuthUser {
	accessToken: string;
	refreshToken?: string;
	user: UserData;
	profile?: ProfileData;
}

let inMemorySession: AuthUser | null = null;
let inMemoryProfile: ProfileData | null = null;

// Keep an existing session when upgrading from the old auth_token/user keys.
const migrateLegacySession = () => {
	if (typeof window === "undefined") return;

	const token = localStorage.getItem("auth_token");
	if (!token) return;

	try {
		const storedUser = localStorage.getItem("user");
		const parsed = storedUser ? JSON.parse(storedUser) : null;
		if (parsed?.accessToken) return;
		if (parsed?.id && parsed?.email) {
			const session: AuthUser = {
				accessToken: token,
				user: {
					...parsed,
					userType: parsed.userType ?? parsed.role ?? "admin",
				},
			};
			localStorage.setItem("user", JSON.stringify(session));
		} else {
			localStorage.removeItem("user");
		}
	} catch {
		localStorage.removeItem("user");
	} finally {
		localStorage.removeItem("auth_token");
	}
};

migrateLegacySession();

export const user_atom = atomWithStorage<AuthUser | null>(
	"user",
	null,
	undefined,
	{ getOnInit: true },
);

export const profile_atom = atomWithStorage<ProfileData | null>(
	"profile",
	null,
	undefined,
	{ getOnInit: true },
);

export const useAuth = () => useAtom(user_atom);
export const useProfile = () => useAtom(profile_atom);

export const get_user_value = (): AuthUser | null => {
	let session = inMemorySession;
	if (typeof window !== "undefined") {
		session = getDefaultStore().get(user_atom) || inMemorySession;
	}
	return session?.accessToken && session.user?.id ? session : null;
};

export const get_profile_value = (): ProfileData | null => {
	let profile = inMemoryProfile;
	if (typeof window !== "undefined") {
		profile = getDefaultStore().get(profile_atom) || inMemoryProfile;
	}
	return profile;
};

export const clear_user = () => {
	inMemorySession = null;
	inMemoryProfile = null;
	const store = getDefaultStore();
	store.set(user_atom, null);
	store.set(profile_atom, null);
	if (typeof window !== "undefined") {
		localStorage.removeItem("user");
		localStorage.removeItem("profile");
		localStorage.removeItem("auth_token");
	}
};

export const set_user_value = (session: AuthUser) => {
	inMemorySession = session;
	getDefaultStore().set(user_atom, session);
};

export const set_profile_value = (profile: ProfileData | null) => {
	inMemoryProfile = profile;
	getDefaultStore().set(profile_atom, profile);
};

export const set_access_token = (token: string) => {
	const session = get_user_value();
	if (session) set_user_value({ ...session, accessToken: token });
};
