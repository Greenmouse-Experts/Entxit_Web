export interface CursorPaginationProps {
	totalCount?: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	onNextPage: () => void;
	onPreviousPage: () => void;
}

export default function CursorPagination({
	totalCount,
	hasNextPage,
	hasPreviousPage,
	onNextPage,
	onPreviousPage,
}: CursorPaginationProps) {
	return (
		<div className="flex items-center justify-between border-t border-base-300 px-4 py-3">
			<span className="text-sm text-base-content/60">
				{totalCount === undefined ? "Results" : `${totalCount} results`}
			</span>
			<div className="join">
				<button
					type="button"
					className="btn btn-sm join-item"
					disabled={!hasPreviousPage}
					onClick={onPreviousPage}
				>
					Previous
				</button>
				<button
					type="button"
					className="btn btn-sm join-item"
					disabled={!hasNextPage}
					onClick={onNextPage}
				>
					Next
				</button>
			</div>
		</div>
	);
}
