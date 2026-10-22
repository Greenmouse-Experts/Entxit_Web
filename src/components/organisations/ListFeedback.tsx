import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

export function ListFeedback({
	loading,
	error,
	empty,
	children,
}: {
	loading: boolean;
	error: boolean;
	empty: boolean;
	children: ReactNode;
}) {
	if (loading) {
		return (
			<div className="flex min-h-48 items-center justify-center gap-2 text-base-content/60">
				<LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
				Loading records…
			</div>
		);
	}
	if (error) {
		return (
			<div role="alert" className="alert alert-error alert-soft my-4">
				<AlertCircle aria-hidden="true" className="size-5" />
				<span>Could not load records. Try refreshing the page.</span>
			</div>
		);
	}
	if (empty) {
		return (
			<div className="flex min-h-48 flex-col items-center justify-center gap-2 text-center text-base-content/60">
				<Inbox aria-hidden="true" className="size-8" />
				<p>No records match this view.</p>
			</div>
		);
	}
	return <>{children}</>;
}
