import { createFileRoute, Outlet } from "@tanstack/react-router";
import HomeNav from "@/components/HomeNav";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<HomeNav />
			<section className="min-h-[calc(100dvh-5rem)] w-full">
				<div className="flex min-h-[calc(100dvh-5rem)] w-full flex-col md:w-1/2">
					<div className="flex flex-1 items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
						<div className="mx-auto w-full max-w-md">
							<Outlet />
						</div>
					</div>
					<footer className="p-6 text-center text-xs text-base-content/50 md:hidden">
						© 2026 EntXit
					</footer>
				</div>
				<aside className="fixed bottom-0 right-0 top-20 hidden w-1/2 p-4 md:block lg:p-6">
					<img
						src="/onboarding/side-image.png"
						alt="EntXit dashboard illustration"
						className="h-full w-full rounded-box object-cover"
					/>
				</aside>
			</section>
		</>
	);
}
