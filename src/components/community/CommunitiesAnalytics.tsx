import { Building2, CalendarDays, Layers3, MapPinned } from "lucide-react";
import { useId } from "react";
import type { SubadminCommunity } from "@/services/types";

interface CommunitiesAnalyticsProps {
	communities: SubadminCommunity[];
}

const monthFormatter = new Intl.DateTimeFormat("en-NG", {
	month: "short",
	timeZone: "UTC",
});
const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

function monthKey(date: Date) {
	return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

export function CommunitiesAnalytics({
	communities,
}: CommunitiesAnalyticsProps) {
	const growthHeadingId = useId();
	const categoriesHeadingId = useId();
	const now = new Date();
	const currentMonth = monthKey(now);
	const datedCommunities = communities
		.map((community) => ({
			community,
			createdAt: community.createdAt ? new Date(community.createdAt) : null,
		}))
		.filter(
			(item): item is { community: SubadminCommunity; createdAt: Date } =>
				item.createdAt !== null && !Number.isNaN(item.createdAt.getTime()),
		);
	const additionsThisMonth = datedCommunities.filter(
		(item) => monthKey(item.createdAt) === currentMonth,
	).length;
	const latest = datedCommunities.reduce<
		(typeof datedCommunities)[number] | null
	>(
		(previous, item) =>
			!previous || item.createdAt > previous.createdAt ? item : previous,
		null,
	);
	const categories = new Map<string, number>();
	for (const community of communities) {
		const category = community.hostCategoryName?.trim();
		if (category) categories.set(category, (categories.get(category) ?? 0) + 1);
	}
	const categoryRows = [...categories].sort(
		(a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
	);
	const visibleCategories = categoryRows.slice(0, 5);
	if (categoryRows.length > 5) {
		visibleCategories.push([
			"Other categories",
			categoryRows.slice(5).reduce((sum, [, count]) => sum + count, 0),
		]);
	}
	const highestCategoryCount = Math.max(
		1,
		...visibleCategories.map(([, count]) => count),
	);
	const months = Array.from({ length: 7 }, (_, index) => {
		const date = new Date(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6 + index, 1),
		);
		return {
			key: monthKey(date),
			label: monthFormatter.format(date),
		};
	}).map((month) => ({
		...month,
		count: datedCommunities.filter(
			(item) => monthKey(item.createdAt) === month.key,
		).length,
	}));
	const highestMonthCount = Math.max(1, ...months.map((month) => month.count));

	const summary = [
		{
			label: "Managed communities",
			value: communities.length.toLocaleString(),
			detail: "Communities assigned to your account",
			icon: Building2,
		},
		{
			label: "Added this month",
			value: additionsThisMonth.toLocaleString(),
			detail: "Based on recorded creation dates",
			icon: CalendarDays,
		},
		{
			label: "Community categories",
			value: categories.size.toLocaleString(),
			detail: "Categories represented in your communities",
			icon: Layers3,
		},
		{
			label: "Latest community",
			value: latest?.community.name ?? "—",
			detail: latest
				? `Added ${dateFormatter.format(latest.createdAt)}`
				: "No creation date on record",
			icon: MapPinned,
		},
	];

	return (
		<section aria-label="Community analytics" className="space-y-5">
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{summary.map(({ label, value, detail, icon: Icon }) => (
					<div
						key={label}
						className="min-w-0 rounded-box border border-base-300 bg-base-100 p-5"
					>
						<div className="flex items-start justify-between gap-3">
							<p className="text-sm font-medium text-base-content/70">
								{label}
							</p>
							<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Icon aria-hidden="true" className="size-5" />
							</span>
						</div>
						<p
							className="mt-4 truncate text-2xl font-semibold tabular-nums text-base-content"
							title={value}
						>
							{value}
						</p>
						<p className="mt-1 text-xs leading-5 text-base-content/65">
							{detail}
						</p>
					</div>
				))}
			</div>
			<div className="grid gap-5 lg:grid-cols-2">
				<section
					aria-labelledby={growthHeadingId}
					className="rounded-box border border-base-300 bg-base-100 p-6"
				>
					<h2 id={growthHeadingId} className="text-base font-semibold">
						Community growth
					</h2>
					<p className="mt-1 text-sm text-base-content/65">
						Communities added in the past seven months
					</p>
					{months.some((month) => month.count > 0) ? (
						<ol className="mt-6 grid grid-cols-7 gap-2">
							{months.map((month) => (
								<li key={month.key} className="min-w-0 text-center">
									<div className="flex h-40 items-end justify-center border-b border-base-300">
										<span
											aria-hidden="true"
											className="w-full max-w-12 rounded-t bg-primary"
											style={{
												height: `${(month.count / highestMonthCount) * 100}%`,
											}}
										/>
									</div>
									<p className="mt-2 text-xs text-base-content/65">
										{month.label}
									</p>
									<p className="text-xs font-semibold tabular-nums">
										{month.count}
									</p>
								</li>
							))}
						</ol>
					) : (
						<p className="flex min-h-44 items-center justify-center text-center text-sm text-base-content/65">
							{datedCommunities.length > 0
								? "No communities were added in the past seven months."
								: "Growth will appear when communities have creation dates."}
						</p>
					)}
				</section>
				<section
					aria-labelledby={categoriesHeadingId}
					className="rounded-box border border-base-300 bg-base-100 p-6"
				>
					<h2 id={categoriesHeadingId} className="text-base font-semibold">
						Community categories
					</h2>
					<p className="mt-1 text-sm text-base-content/65">
						How your communities are classified
					</p>
					{visibleCategories.length > 0 ? (
						<ol className="mt-6 space-y-4">
							{visibleCategories.map(([name, count]) => (
								<li key={name}>
									<div className="flex items-center justify-between gap-3 text-sm">
										<span className="min-w-0 truncate font-medium" title={name}>
											{name}
										</span>
										<span className="shrink-0 font-semibold tabular-nums">
											{count}
										</span>
									</div>
									<div className="mt-2 h-3 overflow-hidden rounded-full bg-base-200">
										<span
											aria-hidden="true"
											className="block h-full rounded-full bg-primary"
											style={{
												width: `${(count / highestCategoryCount) * 100}%`,
											}}
										/>
									</div>
								</li>
							))}
						</ol>
					) : (
						<p className="flex min-h-44 items-center justify-center text-center text-sm text-base-content/65">
							Category totals will appear when communities have categories.
						</p>
					)}
				</section>
			</div>
		</section>
	);
}
