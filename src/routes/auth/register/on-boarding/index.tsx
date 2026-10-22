import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Country, State } from "country-state-city";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type FormEvent, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { extract_message } from "@/lib/api-error";
import {
	type OnboardingFormData,
	useOnboardingStore,
} from "@/store/onboarding-store";

export const Route = createFileRoute("/auth/register/on-boarding/")({
	component: OnboardingWizard,
});

const FACILITY_TYPES = [
	"Residential Estate",
	"Office Building / Office Complex",
	"Commercial Building",
	"Mixed-Use Estate / Complex",
	"Factory / Industrial Facility",
	"Warehouse / Logistics Centre",
	"School / University Campus",
	"Hospital / Healthcare Facility",
	"Shopping Mall / Retail Centre",
	"Hotel / Hospitality Facility",
	"Construction Site",
	"Event Venue",
	"Government Facility",
	"Parking Facility",
	"Port / Terminal",
	"Other",
] as const;

function OnboardingWizard() {
	const id = useId();
	const navigate = useNavigate();
	const { step, formData, nextStep, prevStep, updateFormData, reset } =
		useOnboardingStore();
	const [facilityType, setFacilityType] = useState(formData.facilityType);
	const [countryCode, setCountryCode] = useState(
		() =>
			Country.getAllCountries().find(
				(country) => country.name === formData.communityCountry,
			)?.isoCode ?? "NG",
	);
	const [state, setState] = useState(formData.communityState);
	const [address, setAddress] = useState(formData.communityAddress);
	const [city, setCity] = useState(formData.communityCity);
	const countries = useMemo(() => Country.getAllCountries(), []);
	const states = useMemo(
		() => State.getStatesOfCountry(countryCode),
		[countryCode],
	);

	const completeMutation = useMutation({
		mutationFn: async (data: OnboardingFormData) => {
			await apiClient.patch("/tenant/onboarding", {
				industry: data.facilityType,
				companyAddress: data.communityAddress,
				companyCity: data.communityCity,
				companyCountry: data.communityCountry,
				companyState: data.communityState,
			});
			await apiClient.post("/tenant/onboarding/complete");
		},
		onSuccess: () => {
			reset();
			toast.success("Community setup complete");
			navigate({ to: "/dashboard" });
		},
		onError: (error) => toast.error(extract_message(error)),
	});

	function saveFacility(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!facilityType) return;
		updateFormData({ facilityType });
		nextStep();
	}

	function saveLocation(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const country = countries.find((item) => item.isoCode === countryCode);
		const data: OnboardingFormData = {
			...formData,
			facilityType,
			communityAddress: address.trim(),
			communityCity: city.trim(),
			communityCountry: country?.name ?? "Nigeria",
			communityState: state.trim(),
		};
		if (!data.communityAddress || !data.communityCity || !data.communityState)
			return;
		updateFormData(data);
		completeMutation.mutate(data);
	}

	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight text-base-content">
					Set up your community
				</h1>
				<p className="text-sm text-base-content/70">
					Tell us about your facility and where it is located.
				</p>
			</div>

			<div className="space-y-2">
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

			{step === 1 ? (
				<form onSubmit={saveFacility} className="space-y-6">
					<div className="space-y-2">
						<label
							htmlFor={`${id}-facilityType`}
							className="block text-xl font-semibold text-base-content"
						>
							What types of facilities are within your community?
						</label>
						<p className="text-sm text-base-content/70">
							Choose the option that best describes the primary facility.
						</p>
					</div>
					<select
						id={`${id}-facilityType`}
						name="facilityType"
						className="select select-bordered w-full"
						value={facilityType}
						onChange={(event) => setFacilityType(event.target.value)}
						required
					>
						<option value="" disabled>
							Select a facility type
						</option>
						{FACILITY_TYPES.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
					<div className="flex justify-end">
						<button type="submit" className="btn btn-primary">
							Continue <ArrowRight aria-hidden="true" className="size-4" />
						</button>
					</div>
				</form>
			) : (
				<form onSubmit={saveLocation} className="space-y-5">
					<div className="space-y-2">
						<h2 className="text-xl font-semibold text-base-content">
							Where is your community located?
						</h2>
						<p className="text-sm text-base-content/70">
							Enter the address of the facility you manage.
						</p>
					</div>
					<div className="space-y-1.5">
						<label
							htmlFor={`${id}-communityAddress`}
							className="block text-sm font-medium"
						>
							Street address
						</label>
						<input
							id={`${id}-communityAddress`}
							name="communityAddress"
							className="input input-bordered w-full"
							value={address}
							onChange={(event) => setAddress(event.target.value)}
							autoComplete="street-address"
							required
						/>
					</div>
					<div className="space-y-1.5">
						<label
							htmlFor={`${id}-communityCountry`}
							className="block text-sm font-medium"
						>
							Country
						</label>
						<select
							id={`${id}-communityCountry`}
							name="communityCountry"
							className="select select-bordered w-full"
							value={countryCode}
							onChange={(event) => {
								setCountryCode(event.target.value);
								setState("");
							}}
							required
						>
							{countries.map((country) => (
								<option key={country.isoCode} value={country.isoCode}>
									{country.name}
								</option>
							))}
						</select>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label
								htmlFor={`${id}-communityState`}
								className="block text-sm font-medium"
							>
								State or province
							</label>
							{states.length > 0 ? (
								<select
									id={`${id}-communityState`}
									name="communityState"
									className="select select-bordered w-full"
									value={state}
									onChange={(event) => setState(event.target.value)}
									required
								>
									<option value="" disabled>
										Select a state
									</option>
									{states.map((item) => (
										<option key={item.isoCode} value={item.name}>
											{item.name}
										</option>
									))}
								</select>
							) : (
								<input
									id={`${id}-communityState`}
									name="communityState"
									className="input input-bordered w-full"
									value={state}
									onChange={(event) => setState(event.target.value)}
									autoComplete="address-level1"
									required
								/>
							)}
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor={`${id}-communityCity`}
								className="block text-sm font-medium"
							>
								City or town
							</label>
							<input
								id={`${id}-communityCity`}
								name="communityCity"
								className="input input-bordered w-full"
								value={city}
								onChange={(event) => setCity(event.target.value)}
								autoComplete="address-level2"
								required
							/>
						</div>
					</div>
					<div className="flex items-center justify-between pt-2">
						<button
							type="button"
							className="btn btn-ghost"
							onClick={prevStep}
							disabled={completeMutation.isPending}
						>
							<ArrowLeft aria-hidden="true" className="size-4" /> Back
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={completeMutation.isPending}
						>
							{completeMutation.isPending ? (
								<span className="loading loading-spinner loading-sm" />
							) : (
								"Complete setup"
							)}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
