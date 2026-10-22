import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export const Table = ({ className, ...props }: TableProps) => {
	return (
		<div className="w-full overflow-auto">
			<table className={cn("table w-full", className)} {...props} />
		</div>
	);
};

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = ({ className, ...props }: TableHeaderProps) => {
	return <thead className={cn("bg-base-200", className)} {...props} />;
};

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = ({ className, ...props }: TableBodyProps) => {
	return (
		<tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
	);
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = ({ className, ...props }: TableRowProps) => {
	return (
		<tr
			className={cn(
				"border-b border-base-300 transition-colors hover:bg-base-200",
				className,
			)}
			{...props}
		/>
	);
};

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = ({ className, ...props }: TableHeadProps) => {
	return (
		<th
			className={cn(
				"h-12 px-4 text-left align-middle font-semibold text-base-content/70 [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
};

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = ({ className, ...props }: TableCellProps) => {
	return (
		<td
			className={cn(
				"p-4 align-middle [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
};
