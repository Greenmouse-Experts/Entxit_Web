import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
	sm: "max-w-md",
	md: "max-w-lg",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
	full: "max-w-7xl",
};

export const Modal = ({
	isOpen,
	onClose,
	children,
	size = "md",
}: ModalProps) => (
	<Dialog open={isOpen} onClose={onClose} className="relative z-50">
		<DialogBackdrop className="fixed inset-0 bg-neutral/50" />
		<div className="fixed inset-0 flex items-center justify-center p-4">
			<DialogPanel
				className={cn(
					"modal-box flex max-h-[90vh] w-full flex-col overflow-hidden border border-base-300 bg-base-100 p-0 shadow-xl",
					sizeClasses[size],
				)}
			>
				{children}
			</DialogPanel>
		</div>
	</Dialog>
);

interface ModalHeaderProps {
	children: ReactNode;
	onClose?: () => void;
}

export const ModalHeader = ({ children, onClose }: ModalHeaderProps) => (
	<div className="flex items-center justify-between border-b border-base-300 p-6">
		<DialogTitle className="text-xl font-semibold text-base-content">
			{children}
		</DialogTitle>
		{onClose && (
			<button
				type="button"
				onClick={onClose}
				className="btn btn-ghost btn-square btn-sm"
				aria-label="Close dialog"
			>
				<X className="size-5" aria-hidden="true" />
			</button>
		)}
	</div>
);

interface ModalBodyProps {
	children: ReactNode;
	className?: string;
}

export const ModalBody = ({ children, className }: ModalBodyProps) => (
	<div className={cn("min-h-0 flex-1 overflow-y-auto p-6", className)}>
		{children}
	</div>
);

interface ModalFooterProps {
	children: ReactNode;
	className?: string;
}

export const ModalFooter = ({ children, className }: ModalFooterProps) => (
	<div
		className={cn(
			"flex items-center justify-end gap-3 border-t border-base-300 bg-base-200 p-6",
			className,
		)}
	>
		{children}
	</div>
);
