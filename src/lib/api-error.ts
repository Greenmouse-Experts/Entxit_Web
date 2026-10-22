import type { AxiosError } from "axios";
import type { ApiResponse } from "@/services/types/common.types";

export const extract_message = (error: AxiosError<ApiResponse>): string =>
	error.response?.data?.message || error.message;
