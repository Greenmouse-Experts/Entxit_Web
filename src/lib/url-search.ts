export function positiveInt(value: unknown, fallback: number): number {
	const parsed =
		typeof value === "string" || typeof value === "number"
			? Number(value)
			: NaN;
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function pageSizeParam(value: unknown): number {
	const pageSize = positiveInt(value, 10);
	return [10, 25, 50].includes(pageSize) ? pageSize : 10;
}

export function textParam(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value : undefined;
}
