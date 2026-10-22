export interface ApiResponse<T = any> {
	status: string;
	statusCode: number;
	message: string;
	payload: T;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total?: number;
	pages?: number;
	nextPage?: number | null;
}

export interface PaginatedPayload<T> {
	data: T[];
	pagination?: PaginationMeta;
	page?: number;
	limit?: number;
	total?: number;
	pages?: number;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedPayload<T>>;

export interface PaginationParams {
	page?: number;
	limit?: number;
	search?: string;
	q?: string;
	sortBy?: string;
	order?: "asc" | "desc" | string;
}

export interface DateRangeParams {
	startDate?: string;
	endDate?: string;
	dateFrom?: string;
	dateTo?: string;
}

export interface MessageResponse {
	message: string;
	success?: boolean;
}
