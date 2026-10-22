import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
	primary: "btn-primary",
	secondary: "btn-neutral btn-soft",
	outline: "btn-outline btn-primary",
	ghost: "btn-ghost",
	danger: "btn-error",
	success: "btn-success",
	warning: "btn-warning",
} as const;

const buttonSizes = {
	sm: "btn-sm",
	md: "btn-md",
	lg: "btn-lg",
	icon: "btn-square btn-md",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: keyof typeof buttonVariants;
	size?: keyof typeof buttonSizes;
	isLoading?: boolean;
}

export const Button = ({
	className,
	variant,
	size,
	isLoading,
	children,
	disabled,
	...props
}: ButtonProps) => {
	return (
		<button
			type="button"
			className={cn(
				"btn",
				buttonVariants[variant ?? "primary"],
				buttonSizes[size ?? "md"],
				className,
			)}
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && (
				<svg
					aria-hidden="true"
					className="animate-spin h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			{children}
		</button>
	);
};
