import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const alertVariants = {
	default: "alert-soft",
	success: "alert-success alert-soft",
	warning: "alert-warning alert-soft",
	danger: "alert-error alert-soft",
	info: "alert-info alert-soft",
} as const;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: keyof typeof alertVariants;
	dismissible?: boolean;
	onDismiss?: () => void;
	autoDismiss?: number;
}

export const Alert = ({
	className,
	variant,
	dismissible,
	onDismiss,
	autoDismiss,
	children,
	...props
}: AlertProps) => {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		if (autoDismiss) {
			const timer = setTimeout(() => {
				setIsVisible(false);
				onDismiss?.();
			}, autoDismiss);
			return () => clearTimeout(timer);
		}
	}, [autoDismiss, onDismiss]);

	if (!isVisible) return null;

	const handleDismiss = () => {
		setIsVisible(false);
		onDismiss?.();
	};

	return (
		<div
			role="alert"
			className={cn(
				"alert relative w-full",
				alertVariants[variant ?? "default"],
				className,
			)}
			{...props}
		>
			{children}
			{dismissible && (
				<button
					type="button"
					onClick={handleDismiss}
					className="btn btn-ghost btn-square btn-xs absolute right-2 top-2"
					aria-label="Dismiss alert"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
};

export const AlertTitle = ({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
	return (
		<h5
			className={cn("mb-1 font-medium leading-none tracking-tight", className)}
			{...props}
		/>
	);
};

export const AlertDescription = ({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
	return (
		<div
			className={cn("text-sm [&_p]:leading-relaxed", className)}
			{...props}
		/>
	);
};
