import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { CreditCard, ReceiptText } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";
import { CommunityPicker } from "@/components/community/CommunityPicker";
import PageLoader from "@/components/layout/PageLoader";
import QueryCompLayout from "@/components/layout/QueryCompLayout";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/lib/api-error";
import { textParam } from "@/lib/url-search";
import { paymentsService } from "@/services/payments.service";
import { subadminService } from "@/services/subadmin.service";
import { subscriptionService } from "@/services/subscription.service";
import type {
	CommunitySubscription,
	SubadminCommunity,
	SubscriptionHistoryItem,
	SubscriptionPlan,
} from "@/services/types";

type SubscriptionSearch = { communityId?: string };

export const Route = createFileRoute("/community/subscription")({
	validateSearch: (search: Record<string, unknown>): SubscriptionSearch => ({
		communityId: textParam(search.communityId),
	}),
	component: SubscriptionPage,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
});
const moneyFormatter = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0,
});
const formatDate = (value?: string) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
};
const formatMoney = (value?: number | string) => {
	if (value === undefined || value === null || value === "") return "—";
	const amount = Number(value);
	return Number.isFinite(amount)
		? moneyFormatter.format(amount)
		: String(value);
};
const listFromPayload = <T,>(payload: T[] | { data: T[] }): T[] =>
	Array.isArray(payload) ? payload : payload.data;
const subscriptionFromPayload = (
	payload:
		| CommunitySubscription
		| { data: CommunitySubscription | null }
		| { subscription: CommunitySubscription | null }
		| null,
): CommunitySubscription | null => {
	if (payload && "data" in payload) return payload.data;
	if (payload && "subscription" in payload) return payload.subscription;
	return payload;
};

function SubscriptionPage() {
	const navigate = Route.useNavigate();
	const { communityId } = Route.useSearch();
	const communitiesQuery = useQuery({
		queryKey: ["subadmin", "communities"],
		queryFn: subadminService.getManagedCommunities,
	});

	return (
		<PageLoader
			query={communitiesQuery}
			loadingText="Loading your communities..."
			emptyState={{
				title: "No communities yet",
				description:
					"Subscription details will appear once a community is assigned to you.",
			}}
		>
			{(response) => {
				const communities = response.payload.data;
				const community =
					communities.find((item) => item.id === communityId) ?? communities[0];
				if (!community) return null;
				return (
					<CommunityBilling
						community={community}
						communities={communities}
						onSelect={(id) =>
							navigate({ search: { communityId: id }, replace: true })
						}
					/>
				);
			}}
		</PageLoader>
	);
}

function CommunityBilling({
	community,
	communities,
	onSelect,
}: {
	community: SubadminCommunity;
	communities: SubadminCommunity[];
	onSelect: (id: string) => void;
}) {
	const currentPlanHeadingId = useId();
	const plansHeadingId = useId();
	const historyHeadingId = useId();
	const subscriptionQuery = useQuery({
		queryKey: ["subadmin", "subscription", community.id],
		queryFn: async () => {
			try {
				const response = await subscriptionService.getCommunitySubscription(
					community.id,
				);
				return { subscription: subscriptionFromPayload(response.payload) };
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 404)
					return { subscription: null };
				throw error;
			}
		},
	});
	const plansQuery = useQuery({
		queryKey: ["subadmin", "subscription-plans"],
		queryFn: subscriptionService.getSubadminPlans,
	});
	const historyQuery = useQuery({
		queryKey: ["subadmin", "subscription-history", community.id],
		queryFn: () =>
			subscriptionService.getCommunitySubscriptionHistory(community.id),
	});
	const checkout = useMutation({
		mutationFn: (planId: string) =>
			paymentsService.initiateSubscriptionPayment(community.id, { planId }),
		onSuccess: (response) => {
			const url = response.payload?.authorizationUrl;
			if (!url) {
				toast.error("The payment link was missing. Please try again.");
				return;
			}
			try {
				const destination = new URL(url);
				if (destination.protocol !== "https:")
					throw new Error("Invalid payment URL");
				window.location.assign(destination.href);
			} catch {
				toast.error("The payment link was invalid. Please try again.");
			}
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});
	const planColumns: columnType<SubscriptionPlan>[] = [
		{
			key: "name",
			label: "Plan",
			render: (_, plan) => <span className="font-semibold">{plan.name}</span>,
		},
		{
			key: "price",
			label: "Price",
			render: (_, plan) => (plan.isFreePlan ? "Free" : formatMoney(plan.price)),
		},
		{
			key: "validityInDays",
			label: "Validity",
			render: (_, plan) => `${plan.validityInDays} days`,
		},
		{
			key: "numberOfHosts",
			label: "Capacity",
			render: (_, plan) =>
				`${plan.numberOfHosts} members · ${plan.numberOfSecurities} guards`,
		},
	];
	const planActions: Actions<SubscriptionPlan>[] = [
		{
			key: "checkout",
			label: "Choose plan",
			render: (plan) =>
				plan.isFreePlan
					? "Free plan"
					: plan.isActive === false
						? "Unavailable"
						: "Choose plan",
			disable_event: (plan) =>
				checkout.isPending || plan.isFreePlan || plan.isActive === false,
			action: (plan) => checkout.mutate(plan.id),
		},
	];
	const historyColumns: columnType<SubscriptionHistoryItem>[] = [
		{
			key: "planName",
			label: "Plan",
			render: (_, item) => <span className="font-medium">{item.planName}</span>,
		},
		{
			key: "paymentDate",
			label: "Paid on",
			render: (_, item) => formatDate(item.paymentDate),
		},
		{
			key: "amount",
			label: "Amount",
			render: (_, item) => formatMoney(item.amount),
		},
		{
			key: "status",
			label: "Status",
			render: (_, item) => (
				<span
					className={`badge badge-soft badge-sm capitalize ${item.status === "success" || item.status === "paid" ? "badge-success" : "badge-warning"}`}
				>
					{item.status}
				</span>
			),
		},
		{
			key: "reference",
			label: "Reference",
			render: (_, item) => (
				<span className="font-mono text-xs">{item.reference}</span>
			),
		},
	];

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap items-end justify-between gap-5">
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						Subscription
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
						View the plan and payment history for {community.name}.
					</p>
				</div>
				<CommunityPicker
					communities={communities}
					selectedId={community.id}
					onSelect={onSelect}
				/>
			</div>

			<section aria-labelledby={currentPlanHeadingId} className="space-y-4">
				<div>
					<h2 id={currentPlanHeadingId} className="text-xl font-semibold">
						Current plan
					</h2>
					<p className="mt-1 text-sm text-base-content/70">
						Your community’s current subscription status.
					</p>
				</div>
				<QueryCompLayout query={subscriptionQuery}>
					{(response) => (
						<CurrentSubscription subscription={response.subscription} />
					)}
				</QueryCompLayout>
			</section>

			<section aria-labelledby={plansHeadingId} className="space-y-4">
				<div>
					<h2 id={plansHeadingId} className="text-xl font-semibold">
						Available plans
					</h2>
					<p className="mt-1 text-sm text-base-content/70">
						Choose a plan to continue to secure checkout.
					</p>
				</div>
				<QueryCompLayout query={plansQuery}>
					{(response) => (
						<CustomTable
							data={listFromPayload(response.payload)}
							columns={planColumns}
							actions={planActions}
							caption="Available subscription plans"
							emptyMessage="No subscription plans are available right now."
						/>
					)}
				</QueryCompLayout>
			</section>

			<section aria-labelledby={historyHeadingId} className="space-y-4">
				<div className="flex items-start gap-3">
					<ReceiptText
						aria-hidden="true"
						className="mt-0.5 size-5 text-primary"
					/>
					<div>
						<h2 id={historyHeadingId} className="text-xl font-semibold">
							Payment history
						</h2>
						<p className="mt-1 text-sm text-base-content/70">
							Past subscription payments for this community.
						</p>
					</div>
				</div>
				<QueryCompLayout query={historyQuery}>
					{(response) => (
						<CustomTable
							data={listFromPayload(response.payload)}
							columns={historyColumns}
							caption="Subscription payment history"
							emptyMessage="No subscription payments have been recorded yet."
						/>
					)}
				</QueryCompLayout>
			</section>
		</div>
	);
}

function CurrentSubscription({
	subscription,
}: {
	subscription: CommunitySubscription | null;
}) {
	if (!subscription) {
		return (
			<div className="rounded-box border border-base-300 bg-base-100 p-6 text-sm text-base-content/70">
				No active subscription is on record. Choose a plan below to get started.
			</div>
		);
	}
	const status = subscription.status?.trim();
	return (
		<div className="flex flex-wrap items-start justify-between gap-6 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
			<div>
				<div className="flex flex-wrap items-center gap-3">
					<CreditCard aria-hidden="true" className="size-6 text-primary" />
					<h3 className="text-2xl font-semibold">
						{subscription.planName || "Current subscription"}
					</h3>
					<span
						className={`badge badge-soft capitalize ${status === "active" ? "badge-success" : status ? "badge-warning" : "badge-ghost"}`}
					>
						{status ? status.replaceAll("_", " ") : "Status unavailable"}
					</span>
				</div>
				<p className="mt-3 text-sm text-base-content/70">
					Started {formatDate(subscription.startDate)} · Expires{" "}
					{formatDate(subscription.expiresAt)}
				</p>
			</div>
			{subscription.amountPaid !== undefined && (
				<div className="text-left sm:text-right">
					<p className="text-sm text-base-content/70">Amount paid</p>
					<p className="mt-1 text-xl font-semibold tabular-nums">
						{formatMoney(subscription.amountPaid)}
					</p>
				</div>
			)}
		</div>
	);
}
