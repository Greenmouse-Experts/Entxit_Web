import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import CursorPagination, {
	type CursorPaginationProps,
} from "./CursorPagination";
import PopUp, { type Actions } from "./pop-up";

export type columnType<T> = {
	key: string;
	label: string;
	render?: (value: unknown, item: T) => ReactNode;
	className?: string;
};

export interface TablePagination {
	page: number;
	pageSize: number;
	totalPages?: number;
	setPagination: (page: number, pageSize?: number) => void;
}

interface CustomTableProps<T extends object> {
	data: T[];
	columns: columnType<T>[];
	actions?: Actions<T>[];
	caption?: string;
	emptyMessage?: string;
	ring?: boolean;
	totalCount?: number;
	paginationProps?: TablePagination;
	cursorPaginationProps?: CursorPaginationProps;
	onRowClick?: (item: T) => void;
	rowKey?: (item: T) => string;
}

export default function CustomTable<T extends object>({
	data,
	columns,
	actions,
	caption,
	emptyMessage = "No records match this view.",
	ring = true,
	totalCount: suppliedTotalCount,
	paginationProps,
	cursorPaginationProps,
	onRowClick,
	rowKey,
}: CustomTableProps<T>) {
	const [selectedItem, setSelectedItem] = useState<number | null>(null);
	const totalCount = suppliedTotalCount ?? data.length;
	const page = paginationProps?.page ?? 1;
	const pageSize = paginationProps?.pageSize ?? 10;
	const totalPages =
		paginationProps?.totalPages ??
		Math.max(1, Math.ceil(totalCount / pageSize));
	const startRange = data.length > 0 ? (page - 1) * pageSize + 1 : 0;
	const endRange =
		data.length > 0 ? Math.min(startRange + data.length - 1, totalCount) : 0;
	const hasActions =
		Boolean(actions?.length) &&
		!columns.some((column) => column.key === "action");
	const getKey = (item: T) =>
		rowKey?.(item) ?? ("id" in item ? String(item.id) : JSON.stringify(item));

	return (
		<div
			className={cn(
				"overflow-hidden bg-base-100",
				ring && "rounded-box border border-base-300 shadow-sm",
			)}
		>
			<div className="overflow-x-auto">
				<table className="table w-full text-sm">
					{caption && <caption className="sr-only">{caption}</caption>}
					<thead className="bg-base-200/70 text-base-content/70">
						<tr>
							{columns.map((column) => (
								<th
									key={column.key}
									scope="col"
									className={cn(
										"whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide",
										column.className,
									)}
								>
									{column.label}
								</th>
							))}
							{hasActions && (
								<th
									scope="col"
									className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide"
								>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody className="divide-y divide-base-200">
						{data.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length + Number(hasActions)}
									className="px-5 py-14 text-center"
								>
									<div className="flex flex-col items-center gap-2 text-base-content/60">
										<Inbox aria-hidden="true" className="size-7" />
										<span>{emptyMessage}</span>
									</div>
								</td>
							</tr>
						) : (
							data.map((item, rowIndex) => (
								<tr
									key={getKey(item)}
									className={cn(
										"transition-colors hover:bg-base-200/50",
										onRowClick && "cursor-pointer focus-within:bg-base-200/50",
									)}
									onClick={() => onRowClick?.(item)}
								>
									{columns.map((column) => {
										const value = (item as Record<string, unknown>)[column.key];
										return (
											<td
												key={column.key}
												className={cn(
													"max-w-xs px-5 py-4 align-middle text-base-content",
													column.className,
												)}
											>
												{column.render
													? column.render(value, item)
													: String(value ?? "—")}
											</td>
										);
									})}
									{hasActions && (
										<td className="px-5 py-3 text-right">
											<PopUp
												itemIndex={rowIndex}
												setIndex={setSelectedItem}
												currentIndex={selectedItem}
												actions={actions ?? []}
												item={item}
											/>
										</td>
									)}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			{paginationProps && (
				<div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 bg-base-100 px-5 py-3">
					<p className="text-sm tabular-nums text-base-content/65">
						Showing{" "}
						<strong className="font-semibold text-base-content">
							{startRange}–{endRange}
						</strong>{" "}
						of{" "}
						<strong className="font-semibold text-base-content">
							{totalCount}
						</strong>
					</p>
					<div className="flex flex-wrap items-center gap-2 bg">
						<label className="flex items-center gap-2 text-sm text-base-content/65">
							<span className="whitespace-nowrap"> Rows per page</span>{" "}
							<select
								className="select select-bordered select-sm"
								value={pageSize}
								onChange={(event) =>
									paginationProps.setPagination(1, Number(event.target.value))
								}
							>
								{[10, 25, 50].map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
						</label>
						<span className="mr-1 text-sm tabular-nums text-base-content/65">
							Page {page} of {totalPages}
						</span>
						<button
							type="button"
							className="btn btn-outline btn-sm btn-square"
							aria-label="Previous page"
							disabled={page <= 1}
							onClick={() => paginationProps.setPagination(page - 1)}
						>
							<ChevronLeft aria-hidden="true" className="size-4" />
						</button>
						<button
							type="button"
							className="btn btn-outline btn-sm btn-square"
							aria-label="Next page"
							disabled={page >= totalPages}
							onClick={() => paginationProps.setPagination(page + 1)}
						>
							<ChevronRight aria-hidden="true" className="size-4" />
						</button>
					</div>
				</div>
			)}
			{cursorPaginationProps && (
				<CursorPagination
					{...cursorPaginationProps}
					totalCount={suppliedTotalCount ?? cursorPaginationProps.totalCount}
				/>
			)}
		</div>
	);
}
