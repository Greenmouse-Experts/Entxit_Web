import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { extract_message } from "@/lib/api-error";
import { useAuth, useProfile } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboarding-store";

export const useLogout = (logoutFn?: () => Promise<any>) => {
	const [, setUser] = useAuth();
	const [, setProfile] = useProfile();
	const resetOnboarding = useOnboardingStore((state) => state.reset);
	const nav = useNavigate();
	const { mutateAsync } = useMutation({
		mutationFn:
			logoutFn ||
			(async () => {
				const resp = await apiClient.put("/auth/users/logout");
				return resp.data;
			}),
		onSuccess: () => {
			setUser(null);
			setProfile(null);
			resetOnboarding();
			nav({ to: "/login" });
		},
	});
	const logout = () => {
		toast.promise(mutateAsync(), {
			loading: "Logging out...",
			success: extract_message,
			error: extract_message,
		});
	};
	return { logout };
};
