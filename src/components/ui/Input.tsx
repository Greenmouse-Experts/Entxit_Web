import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Input = ({
	className,
	label,
	error,
	helperText,
	id,
	type = "text",
	...props
}: InputProps) => {
	const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="mb-1.5 block text-sm font-medium text-base-content"
				>
					{label}
					{props.required && <span className="ml-1 text-error">*</span>}
				</label>
			)}
			<input
				id={inputId}
				type={type}
				className={cn("input w-full", error && "input-error", className)}
				{...props}
			/>
			{error && <p className="mt-1.5 text-sm text-error">{error}</p>}
			{helperText && !error && (
				<p className="mt-1.5 text-sm text-base-content/70">{helperText}</p>
			)}
		</div>
	);
};

export const Textarea = ({
	className,
	label,
	error,
	helperText,
	id,
	required,
	...props
}: TextareaProps) => {
	const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="mb-1.5 block text-sm font-medium text-base-content"
				>
					{label}
					{required && <span className="ml-1 text-error">*</span>}
				</label>
			)}
			<textarea
				id={inputId}
				required={required}
				className={cn(
					"textarea min-h-20 w-full",
					error && "textarea-error",
					className,
				)}
				{...props}
			/>
			{error && <p className="mt-1.5 text-sm text-error">{error}</p>}
			{helperText && !error && (
				<p className="mt-1.5 text-sm text-base-content/70">{helperText}</p>
			)}
		</div>
	);
};
