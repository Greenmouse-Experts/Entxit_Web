import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	error?: string;
	helperText?: string;
	options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = ({
	className,
	label,
	error,
	helperText,
	options,
	id,
	...props
}: SelectProps) => {
	const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={selectId}
					className="mb-1.5 block text-sm font-medium text-base-content"
				>
					{label}
					{props.required && <span className="ml-1 text-error">*</span>}
				</label>
			)}
			<select
				id={selectId}
				className={cn("select w-full", error && "select-error", className)}
				{...props}
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						disabled={option.disabled}
					>
						{option.label}
					</option>
				))}
			</select>
			{error && <p className="mt-1.5 text-sm text-error">{error}</p>}
			{helperText && !error && (
				<p className="mt-1.5 text-sm text-base-content/70">{helperText}</p>
			)}
		</div>
	);
};
