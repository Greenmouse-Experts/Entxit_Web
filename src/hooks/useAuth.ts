import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { authService, type LoginCredentials } from "../services/auth.service";
import { useAuth as useStoredAuth } from "../store/authStore";

export const useAuth = () => {
	const [session] = useStoredAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const loginMutation = useMutation({
		mutationFn: (credentials: LoginCredentials) =>
			authService.login(credentials),
		onSuccess: () => {
			toast.success("Welcome back!", {
				description: "You have successfully logged in.",
			});
			navigate({ to: "/dashboard" });
		},
		onError: (error: unknown) => {
			const apiError = error as {
				response?: { data?: { message?: string } };
				message?: string;
			};
			toast.error("Login Failed", {
				description:
					apiError.response?.data?.message ??
					apiError.message ??
					"Login failed. Please try again.",
			});
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => authService.logout(),
		onSuccess: () => {
			queryClient.clear();
			toast.success("Logged out successfully", {
				description: "See you next time!",
			});
			navigate({ to: "/login" });
		},
	});

	return {
		login: loginMutation.mutate,
		loginAsync: loginMutation.mutateAsync,
		logout: logoutMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		isLoggingOut: logoutMutation.isPending,
		loginError: loginMutation.error,
		user: session?.user ?? null,
		isAuthenticated: Boolean(session?.accessToken),
		resetLoginError: loginMutation.reset,
	};
};
