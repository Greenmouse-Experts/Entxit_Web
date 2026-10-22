import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
	default: "badge-primary badge-soft",
	success: "badge-success badge-soft",
	warning: "badge-warning badge-soft",
	danger: "badge-error badge-soft",
	info: "badge-info badge-soft",
	neutral: "badge-neutral badge-soft",
	purple: "badge-secondary badge-soft",
	outline: "badge-outline",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: keyof typeof badgeVariants;
}

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
	return (
		<span
			className={cn(
				"badge badge-sm",
				badgeVariants[variant ?? "default"],
				className,
			)}
			{...props}
		/>
	);
};
