import type {
	QueryObserverResult,
	UseQueryResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { AlertCircle, RefreshCcw, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";
import { extract_message } from "@/lib/api-error";
import type { ApiResponse } from "@/services/types/common.types";

interface QueryCompLayoutProps<T> {
	query: UseQueryResult<T, any> | QueryObserverResult<T, any>;
	children: ReactNode | ((data: T) => ReactNode);
	customLoading?: ReactNode;
}

export default function QueryCompLayout<T>({
	query,
	children,
	customLoading,
}: QueryCompLayoutProps<T>) {
	if (query.isLoading) {
		if (customLoading) return <>{customLoading}</>;
		return (
			<div className="flex items-center justify-center py-8">
				<span className="loading loading-spinner loading-md text-primary" />
			</div>
		);
	}

	if (query.isError) {
		const axiosErr = query.error as AxiosError<ApiResponse> | undefined;
		const status =
			axiosErr?.response?.status ??
			(query.error as { status?: number })?.status;
		const is403 = status === 403 || status === 401;

		if (is403) {
			return (
				<div className="min-h-[40vh] w-full flex flex-col items-center justify-center p-6 text-center motion-safe:animate-[entxit-zoom-in_.3s_ease-out]">
					<div className="mb-4 rounded-full bg-error/10 p-3 text-error">
						<ShieldOff className="h-8 w-8" />
					</div>
					<h3 className="text-lg font-semibold text-base-content">
						Access Denied
					</h3>
					<p className="mt-1 text-sm text-base-content/60 max-w-xs">
						{extract_message(query.error) ||
							"You don't have permission to view this resource."}
					</p>
				</div>
			);
		}

		return (
			<div className="min-h-32 w-full flex flex-col items-center justify-center p-6 text-center motion-safe:animate-[entxit-zoom-in_.3s_ease-out]">
				<div className="mb-4 rounded-full bg-error/10 p-3 text-error">
					<AlertCircle className="h-8 w-8" />
				</div>
				<h3 className="text-lg font-semibold text-base-content">
					Something went wrong
				</h3>
				<p className="mt-1 text-sm text-base-content/60 max-w-xs">
					{extract_message(query.error)}
				</p>
				<button
					type="button"
					onClick={() => query.refetch()}
					className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-content hover:opacity-90 transition-all active:scale-95"
				>
					<RefreshCcw className="h-4 w-4" />
					Try Again
				</button>
			</div>
		);
	}

	if (query.data === undefined || query.data === null) return null;
	return (
		<>{typeof children === "function" ? children(query.data) : children}</>
	);
}
