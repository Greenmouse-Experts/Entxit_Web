import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import SimpleInput from "@/components/inputs/SimpleInput";
import SimplePhoneInput from "@/components/inputs/SimplePhoneInput";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import { extract_message } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import type { RegisterSubadminDto } from "@/services/types";
import { usersService } from "@/services/users.service";

export const Route = createFileRoute("/auth/register/")({
	component: RegisterPage,
});

function RegisterPage() {
	const categoryId = useId();
	const typeId = useId();
	const [step, setStep] = useState<1 | 2>(1);
	const navigate = useNavigate();
	const form = useForm<RegisterSubadminDto>({
		mode: "onTouched",
		shouldUnregister: false,
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			phone: "",
			hostCommunityName: "",
			hostCommunityCategoryId: "",
			hostCommunityTypeId: "",
			state: "",
			address: "",
		},
	});
	const categories = useQuery({
		queryKey: ["users", "host-categories"],
		queryFn: usersService.getHostCategories,
	});
	const types = useQuery({
		queryKey: ["users", "host-community-types"],
		queryFn: usersService.getHostCommunityTypes,
	});
	const registration = useMutation({
		mutationFn: (values: RegisterSubadminDto) =>
			authService.registerSubadmin({
				...values,
				firstName: values.firstName.trim(),
				lastName: values.lastName.trim(),
				email: values.email.trim().toLowerCase(),
				phone: values.phone.replace(/[^\d+]/g, ""),
				hostCommunityName: values.hostCommunityName.trim(),
				state: values.state.trim(),
				address: values.address.trim(),
			}),
		onSuccess: (response, values) => {
			const userId = response.payload?.id;
			if (!userId) {
				toast.error(
					"Account created, but verification details are missing. Please contact support.",
				);
				return;
			}
			toast.success("Account created! Please verify your email.");
			navigate({
				to: "/auth/verify",
				search: { userId, email: values.email.trim().toLowerCase() },
			});
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});

	const requiredText = (label: string) => ({
		required: `${label} is required`,
		validate: (value: string) =>
			Boolean(value.trim()) || `${label} is required`,
	});

	async function continueToCommunity() {
		const valid = await form.trigger(
			["firstName", "lastName", "email", "phone", "password"],
			{ shouldFocus: true },
		);
		if (valid) setStep(2);
	}

	return (
		<FormProvider {...form}>
			<div className="space-y-8">
				<div className="space-y-1">
					<h1 className="text-3xl font-semibold tracking-tight">Get started</h1>
					<p className="text-sm text-base-content/65">
						Create an account for your community.
					</p>
				</div>
				<div
					className="space-y-2"
					role="progressbar"
					aria-label="Registration progress"
					aria-valuemin={1}
					aria-valuemax={2}
					aria-valuenow={step}
				>
					<div className="flex gap-2" aria-hidden="true">
						<span className="h-1.5 flex-1 rounded-full bg-primary" />
						<span
							className={`h-1.5 flex-1 rounded-full ${step === 2 ? "bg-primary" : "bg-base-300"}`}
						/>
					</div>
					<p className="text-xs font-medium text-base-content/70">
						Step {step} of 2
					</p>
				</div>
				<form
					onSubmit={
						step === 1
							? (event) => {
									event.preventDefault();
									void continueToCommunity();
								}
							: form.handleSubmit((values) => {
									if (categories.isSuccess && types.isSuccess) {
										registration.mutate(values);
									}
								})
					}
					className="space-y-5"
				>
					{step === 1 ? (
						<div className="space-y-5">
							<h2 className="text-xl font-semibold">Your details</h2>
							<div className="grid gap-4 sm:grid-cols-2">
								<SimpleInput
									label="First name"
									autoComplete="given-name"
									{...form.register("firstName", requiredText("First name"))}
								/>
								<SimpleInput
									label="Last name"
									autoComplete="family-name"
									{...form.register("lastName", requiredText("Last name"))}
								/>
							</div>
							<SimpleInput
								label="Email address"
								type="email"
								autoComplete="email"
								{...form.register("email", {
									required: "Email is required",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Enter a valid email address",
									},
								})}
							/>
							<Controller
								name="phone"
								control={form.control}
								rules={{
									required: "Phone number is required",
									validate: (value) =>
										/^\+[1-9]\d{7,14}$/.test(value.replace(/[^\d+]/g, "")) ||
										"Enter a valid phone number with country code",
								}}
								render={({ field, fieldState }) => (
									<SimplePhoneInput
										label="Phone number"
										value={field.value}
										ref={field.ref}
										onChange={(_, rawValue) => field.onChange(rawValue ?? "")}
										onBlur={field.onBlur}
										error={fieldState.error?.message}
										autoComplete="tel"
									/>
								)}
							/>
							<SimpleInput
								label="Password"
								type="password"
								autoComplete="new-password"
								{...form.register("password", {
									required: "Password is required",
									minLength: { value: 8, message: "Use at least 8 characters" },
								})}
							/>
							<div className="flex justify-end pt-1">
								<button
									type="submit"
									className="btn btn-primary"
									onClick={continueToCommunity}
								>
									Continue
								</button>
							</div>
						</div>
					) : (
						<div className="space-y-5">
							<h2 className="text-xl font-semibold">Community details</h2>
							<SimpleInput
								label="Community name"
								autoComplete="organization"
								{...form.register(
									"hostCommunityName",
									requiredText("Community name"),
								)}
							/>
							<div className="space-y-2">
								<label
									htmlFor={categoryId}
									className="block text-sm font-semibold"
								>
									Community category
								</label>
								<QueryCompLayout query={categories}>
									{(response) => (
										<select
											id={categoryId}
											className="select select-bordered w-full"
											{...form.register("hostCommunityCategoryId", {
												required: "Select a community category",
											})}
										>
											<option value="">Select a category</option>
											{response.payload.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											))}
										</select>
									)}
								</QueryCompLayout>
								{form.formState.errors.hostCommunityCategoryId && (
									<p className="text-sm text-error">
										{form.formState.errors.hostCommunityCategoryId.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<label htmlFor={typeId} className="block text-sm font-semibold">
									Community type
								</label>
								<QueryCompLayout query={types}>
									{(response) => (
										<select
											id={typeId}
											className="select select-bordered w-full"
											{...form.register("hostCommunityTypeId", {
												required: "Select a community type",
											})}
										>
											<option value="">Select a type</option>
											{response.payload.map((type) => (
												<option key={type.id} value={type.id}>
													{type.name}
												</option>
											))}
										</select>
									)}
								</QueryCompLayout>
								{form.formState.errors.hostCommunityTypeId && (
									<p className="text-sm text-error">
										{form.formState.errors.hostCommunityTypeId.message}
									</p>
								)}
							</div>
							<SimpleInput
								label="State"
								autoComplete="address-level1"
								{...form.register("state", requiredText("State"))}
							/>
							<SimpleInput
								label="Street address"
								autoComplete="street-address"
								{...form.register("address", requiredText("Address"))}
							/>
							<div className="flex items-center justify-between gap-3 pt-1">
								<button
									type="button"
									className="btn btn-ghost"
									onClick={() => setStep(1)}
									disabled={registration.isPending}
								>
									Back
								</button>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={
										registration.isPending ||
										!categories.isSuccess ||
										!types.isSuccess
									}
								>
									{registration.isPending ? (
										<span className="loading loading-spinner loading-sm" />
									) : (
										"Create account"
									)}
								</button>
							</div>
						</div>
					)}
				</form>
				<p className="text-center text-sm text-base-content/65">
					Already have an account?{" "}
					<Link
						to="/auth/login"
						search={{ account: "community", email: "" }}
						className="font-semibold text-primary hover:underline"
					>
						Sign in
					</Link>
				</p>
			</div>
		</FormProvider>
	);
}
