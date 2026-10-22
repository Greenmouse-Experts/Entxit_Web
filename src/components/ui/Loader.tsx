import { cn } from "../../lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
	return (
		<div className={cn("flex items-center justify-center", className)}>
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
		</div>
	);
};

export const PageLoader = () => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<Spinner className="mb-4" />
				<p className="text-gray-600">Loading...</p>
			</div>
		</div>
	);
};
