import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
}

export const Checkbox = ({ className, label, id, ...props }: CheckboxProps) => {
	const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="flex items-center">
			<input
				id={checkboxId}
				type="checkbox"
				className={cn("checkbox checkbox-primary checkbox-sm", className)}
				{...props}
			/>
			{label && (
				<label
					htmlFor={checkboxId}
					className="ml-2 text-sm font-medium text-base-content cursor-pointer"
				>
					{label}
				</label>
			)}
		</div>
	);
};

export interface RadioProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	label?: string;
}

export const Radio = ({ className, label, id, ...props }: RadioProps) => {
	const radioId = id || label?.toLowerCase().replace(/\s+/g, "-");

	return (
		<div className="flex items-center">
			<input
				id={radioId}
				type="radio"
				className={cn("radio radio-primary radio-sm", className)}
				{...props}
			/>
			{label && (
				<label
					htmlFor={radioId}
					className="ml-2 text-sm font-medium text-base-content cursor-pointer"
				>
					{label}
				</label>
			)}
		</div>
	);
};
