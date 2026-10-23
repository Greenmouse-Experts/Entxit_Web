import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingFormData {
	facilityType: string;
	communityAddress: string;
	communityCity: string;
	communityCountry: string;
	communityState: string;
	tenantCount: string;
}

interface OnboardingState {
	step: number;
	formData: OnboardingFormData;
	setStep: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
	updateFormData: (data: Partial<OnboardingFormData>) => void;
	reset: () => void;
}

const defaultFormData: OnboardingFormData = {
	facilityType: "",
	communityAddress: "",
	communityCity: "",
	communityCountry: "Nigeria",
	communityState: "",
	tenantCount: "",
};

export const useOnboardingStore = create<OnboardingState>()(
	persist(
		(set) => ({
			step: 1,
			formData: { ...defaultFormData },
			setStep: (step) => set({ step: Math.min(2, Math.max(1, step)) }),
			nextStep: () => set((state) => ({ step: Math.min(2, state.step + 1) })),
			prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
			updateFormData: (data) =>
				set((state) => ({ formData: { ...state.formData, ...data } })),
			reset: () => set({ step: 1, formData: { ...defaultFormData } }),
		}),
		{
			name: "onboarding-storage",
			version: 2,
			migrate: (persistedState) => {
				const previous = persistedState as {
					formData?: Record<string, unknown>;
				} | null;
				const data = previous?.formData ?? {};
				return {
					step: 1,
					formData: {
						...defaultFormData,
						communityAddress: String(
							data.communityAddress ?? data.companyAddress ?? "",
						),
						communityCity: String(data.communityCity ?? data.companyCity ?? ""),
						communityCountry: String(
							data.communityCountry ?? data.companyCountry ?? "Nigeria",
						),
						communityState: String(
							data.communityState ?? data.companyState ?? "",
						),
						tenantCount: String(data.tenantCount ?? ""),
					},
				};
			},
		},
	),
);
