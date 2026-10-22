import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/organisations")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Outlet />
		</>
	);
}
