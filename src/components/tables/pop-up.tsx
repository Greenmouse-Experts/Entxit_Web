import { useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import Portal from "./Portal";

export type Actions<T> = {
	key: string;
	label: string;
	action: (item: T, nav: ReturnType<typeof useNavigate>) => unknown;
	render?: (item: T) => ReactNode | string;
	disabled?: (item: T) => boolean;
	disable_event?: (item: T) => boolean;
};
type currentIndex = number;
export default function PopUp<T>(props: {
	actions: Actions<T>[];
	item: T;
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
	const nav = useNavigate();

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
	const togglePopup = () => props.setIndex(isOpen ? null : props.itemIndex);
	return (
		<>
			<button
				type="button"
				aria-label="Open row actions"
				aria-expanded={isOpen}
				ref={setReferenceElement}
				onClick={togglePopup}
				className="btn btn-ghost btn-sm btn-square"
			>
				<Menu className="size-5 text-base-content/70" />
			</button>
			<Portal>
				{isOpen && (
					<div
						ref={(el) => {
							setPopperElement(el);
							popupRef.current = el;
						}}
						className="z-[100] w-40 rounded-box border border-base-300 bg-base-100 p-1 text-base-content shadow-lg"
						style={{
							...styles.popper,
						}}
						{...attributes.popper}
					>
						<ul className="menu w-full">
							{props.actions.map((action) => {
								if (action.disabled?.(props.item)) {
									return null;
								}
								return (
									<li key={action.key}>
										<button
											type="button"
											disabled={action.disable_event?.(props.item)}
											onClick={() => {
												action.action(props.item, nav);
												props.setIndex(null);
											}}
											className="text-xs disabled:cursor-not-allowed disabled:opacity-50"
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
