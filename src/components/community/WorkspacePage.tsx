import type { LucideIcon } from "lucide-react";

interface WorkspacePageProps {
	title: string;
	description: string;
	panelTitle: string;
	panelDescription: string;
	icon: LucideIcon;
}

export function WorkspacePage({
	title,
	description,
	panelTitle,
	panelDescription,
	icon: Icon,
}: WorkspacePageProps) {
	return (
		<div className="space-y-8">
			<div className="max-w-2xl space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					{title}
				</h1>
				<p className="text-base text-base-content/70">{description}</p>
			</div>
			<section className="flex min-h-72 flex-col items-center justify-center rounded-box border border-base-300 bg-base-100 px-6 py-12 text-center">
				<span className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Icon aria-hidden="true" className="size-7" />
				</span>
				<h2 className="mt-5 text-lg font-semibold">{panelTitle}</h2>
				<p className="mt-2 max-w-md text-sm leading-6 text-base-content/70">
					{panelDescription}
				</p>
			</section>
		</div>
	);
}
