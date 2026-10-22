import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => {
	return (
		<div
			className={cn(
				"card border border-base-300 bg-base-100 shadow-sm",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardHeader = ({
	className,
	children,
	...props
}: CardHeaderProps) => {
	return (
		<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
			{children}
		</div>
	);
};

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode;
}

export const CardTitle = ({
	className,
	children,
	...props
}: CardTitleProps) => {
	return (
		<h3
			className={cn(
				"text-lg font-semibold leading-none tracking-tight",
				className,
			)}
			{...props}
		>
			{children}
		</h3>
	);
};

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
	children: ReactNode;
}

export const CardDescription = ({
	className,
	children,
	...props
}: CardDescriptionProps) => {
	return (
		<p className={cn("text-sm text-base-content/70", className)} {...props}>
			{children}
		</p>
	);
};

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardContent = ({
	className,
	children,
	...props
}: CardContentProps) => {
	return (
		<div className={cn("p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export const CardFooter = ({
	className,
	children,
	...props
}: CardFooterProps) => {
	return (
		<div className={cn("flex items-center p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
};
