import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: string;
	size?: "sm" | "md" | "lg" | "full";
}

const sizeClasses = {
	sm: "h-[40vh]",
	md: "h-[60vh]",
	lg: "h-[85vh]",
	full: "h-[95vh]",
};

export const BottomSheet = ({
	isOpen,
	onClose,
	children,
	title,
	size = "lg",
}: BottomSheetProps) => (
	<Dialog open={isOpen} onClose={onClose} className="relative z-50">
		<DialogBackdrop className="fixed inset-0 bg-neutral/50" />
		<div className="fixed inset-0 flex items-end justify-center">
			<DialogPanel
				className={cn(
					"flex w-full flex-col rounded-t-3xl border border-base-300 bg-base-100 shadow-xl",
					sizeClasses[size],
				)}
			>
				<div className="flex justify-center pb-2 pt-3" aria-hidden="true">
					<div className="h-1.5 w-12 rounded-full bg-base-300" />
				</div>
				{title && (
					<div className="flex items-center justify-between border-b border-base-300 px-6 py-4">
						<DialogTitle className="text-xl font-bold text-base-content">
							{title}
						</DialogTitle>
						<button
							type="button"
							onClick={onClose}
							className="btn btn-ghost btn-square btn-sm"
							aria-label="Close sheet"
						>
							<X className="size-5" aria-hidden="true" />
						</button>
					</div>
				)}
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
					{children}
				</div>
			</DialogPanel>
		</div>
	</Dialog>
);

interface BottomSheetHeaderProps {
	children: ReactNode;
	className?: string;
}

export const BottomSheetHeader = ({
	children,
	className,
}: BottomSheetHeaderProps) => (
	<div className={cn("mb-6", className)}>{children}</div>
);

interface BottomSheetTitleProps {
	children: ReactNode;
	className?: string;
}

export const BottomSheetTitle = ({
	children,
	className,
}: BottomSheetTitleProps) => (
	<DialogTitle
		className={cn("text-2xl font-bold text-base-content", className)}
	>
		{children}
	</DialogTitle>
);

interface BottomSheetDescriptionProps {
	children: ReactNode;
	className?: string;
}

export const BottomSheetDescription = ({
	children,
	className,
}: BottomSheetDescriptionProps) => (
	<p className={cn("mt-2 text-base-content/70", className)}>{children}</p>
);
