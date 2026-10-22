import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	value: string | number;
	description?: string;
	icon?: React.ReactNode;
	trend?: {
		value: string;
		isPositive: boolean;
	};
}

export const StatCard = ({
	title,
	value,
	description,
	icon,
	trend,
	className,
	...props
}: StatCardProps) => {
	return (
		<div
			className={cn(
				"card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md",
				className,
			)}
			{...props}
		>
			<div className="p-5">
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<p className="text-sm font-medium text-base-content/70">{title}</p>
					</div>
					{icon && (
						<div className="flex-shrink-0">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
								{icon}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-1">
					<p className="text-3xl font-bold text-base-content">{value}</p>
					{description && (
						<p className="text-sm text-base-content/70">{description}</p>
					)}
					{trend && (
						<div className="flex items-center gap-1 pt-0.5">
							<span
								className={cn(
									"text-sm font-semibold",
									trend.isPositive ? "text-primary" : "text-error",
								)}
							>
								{trend.isPositive ? "↑" : "↓"} {trend.value}
							</span>
							<span className="text-xs text-base-content/60">
								vs last period
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
