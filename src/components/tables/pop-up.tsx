import { useNavigate } from "@tanstack/react-router"; // Import useNavigate
import { Menu } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import Portal from "./Portal";

export type Actions<T = any> = {
	key: string;
	label: string;
	action: (item: T, nav: ReturnType<typeof useNavigate>) => any;
	render?: (item: T) => ReactNode | string;
	disabled?: (item: T) => boolean;
	disable_event?: (item: T) => boolean;
};
type currentIndex = number;
export default function PopUp<T>(props: {
	actions: Actions<T>[];
	item: any;
	currentIndex: currentIndex | null;
	setIndex: (index: number | null) => void;
	itemIndex: number;
	disable_event?: (item: T) => boolean;
}) {
	const [referenceElement, setReferenceElement] =
		useState<HTMLButtonElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
		null,
	);
	const isOpen = props.itemIndex === props.currentIndex;
	const popupRef = useRef<HTMLDivElement>(null);
	const nav = useNavigate(); // Get the useNavigate instance

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				popupRef.current &&
				!popupRef.current.contains(event.target as Node) &&
				referenceElement &&
				!referenceElement.contains(event.target as Node)
			) {
				props.setIndex(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, props.setIndex, referenceElement]);

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: "bottom-end",
		modifiers: [
			{
				name: "offset",
				options: {
					offset: [0, 8],
				},
			},
		],
	});
	const openPopup = () => {
		props.setIndex(props.itemIndex);
	};
	return (
		<>
			<button
				type="button"
				aria-label="Open row actions"
				aria-expanded={isOpen}
				data-theme="nh-light"
				ref={setReferenceElement}
				onClick={openPopup}
				className="btn btn-circle btn-ghost "
			>
				<Menu size={20} className="label" />
			</button>
			<Portal>
				{isOpen && (
					<div
						data-theme="nh-light"
						ref={(el) => {
							setPopperElement(el);
							popupRef.current = el;
						}}
						className="shadow-lg border border-current/20 rounded-xl bg-base-100 z-50 "
						style={{
							...styles.popper,
							width: "150px",
						}}
						{...attributes.popper}
					>
						<ul className="menu w-full">
							{props?.actions?.map((action) => {
								if (action.disabled && action.disabled(props.item)) {
									return null;
								}
								return (
									<li key={action.key}>
										<button
											type="button"
											onClick={() => {
												if (
													action.disable_event &&
													action.disable_event(props.item)
												)
													return;
												action.action(props.item, nav);
											}}
											className={`text-xs ${action.disable_event && action.disable_event(props.item) ? "cursor-not-allowed" : ""}`}
										>
											{action.render ? action.render(props.item) : action.label}
										</button>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</Portal>
		</>
	);
}
