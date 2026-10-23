import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/login/")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, unknown>,
	): { account?: "community"; email?: string } => ({
		account: search.account === "community" ? "community" : undefined,
		email: typeof search.email === "string" ? search.email : undefined,
	}),
});

function RouteComponent() {
	const { account, email: initialEmail } = Route.useSearch();
	const { login, isLoggingIn, resetLoginError } = useAuth(account);
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState(initialEmail ?? "");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		resetLoginError();

		login({
			email,
			password,
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/8 to-gray-50 relative overflow-hidden">
			{/* Animated Background Shapes - Enhanced */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Mesh gradient overlay */}
				<div className="absolute inset-0 auth-glow"></div>

				{/* Floating orbs */}
				<div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
				<div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-success/25 rounded-full blur-3xl translate-x-1/3"></div>
				<div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-success/20 rounded-full blur-3xl translate-y-1/3"></div>
				<div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-primary/15 rounded-full blur-2xl"></div>
				<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-success/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>

				{/* Subtle grid pattern */}
				<div className="absolute inset-0 auth-grid"></div>
			</div>

			{/* Main Content - Centered vertically */}
			<div className="flex items-center justify-center min-h-screen px-4 py-12 relative z-10">
				<div className="w-full max-w-md">
					{/* Logo and title outside card */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">EntXit</h1>
						<p className="text-sm text-primary font-medium">
							{account === "community"
								? "Community portal"
								: "Super Admin Portal"}
						</p>
					</div>

					{/* Login Card */}
					<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-8 relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

						<div className="mb-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Welcome Back
							</h2>
							<p className="text-gray-600 text-sm">
								Sign in to access your{" "}
								{account === "community"
									? "community workspace"
									: "admin dashboard"}
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							{/* Email Input */}
							<div>
								<Input
									label="Email Address"
									type="email"
									placeholder="admin@entxit.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoggingIn}
								/>
							</div>

							{/* Password Input */}
							<div>
								<div className="relative">
									<Input
										label="Password"
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										disabled={isLoggingIn}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
										disabled={isLoggingIn}
									>
										{showPassword ? (
											<EyeOff className="w-5 h-5" />
										) : (
											<Eye className="w-5 h-5" />
										)}
									</button>
								</div>
							</div>

							{/* Remember Me & Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Checkbox
										label="Remember me"
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
										disabled={isLoggingIn}
									/>
								</div>
								<button
									type="button"
									className="text-sm text-primary hover:text-primary/90 font-medium disabled:opacity-50"
									disabled={isLoggingIn}
								>
									Forgot Password?
								</button>
							</div>

							{/* Login Button */}
							<Button type="submit" className="w-full" disabled={isLoggingIn}>
								{isLoggingIn ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										Signing in...
									</div>
								) : (
									"Sign In"
								)}
							</Button>
						</form>
						<Link
							to="/auth/register"
							className="text-sm text-primary my-2 hover:text-primary/90 font-medium block"
						>
							<span className="text-base-content">Not a member?</span>{" "}
							<span>Register</span>
						</Link>
						{/* Demo Credentials */}
						{account !== "community" && (
							<div className=" p-4 bg-gray-50 rounded-lg border border-gray-200">
								<p className="text-xs font-semibold text-gray-700 mb-2">
									Demo Credentials:
								</p>
								<p className="text-xs text-gray-600">
									Email: greenmousedev+admin@gmail.com
								</p>
								<p className="text-xs text-gray-600">Password: admin123</p>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="text-center mt-6">
						<p className="text-sm text-gray-500">
							© 2025 EntXit. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
