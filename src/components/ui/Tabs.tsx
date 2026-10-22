import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

interface TabsProps {
	defaultValue: string;
	children: ReactNode;
	className?: string;
}

interface TabsListProps {
	children: ReactNode;
	className?: string;
}

interface TabsTriggerProps {
	value: string;
	children: ReactNode;
	className?: string;
}

interface TabsContentProps {
	value: string;
	children: ReactNode;
	className?: string;
}

export const Tabs = ({ defaultValue, children, className }: TabsProps) => {
	const nodes = Children.toArray(children).filter(isValidElement);
	const list = nodes.find((node) => node.type === TabsList) as
		| ReactElement<TabsListProps>
		| undefined;
	const panels = nodes.filter((node) => node.type === TabsContent);
	const triggers = Children.toArray(list?.props.children).filter(
		isValidElement,
	) as ReactElement<TabsTriggerProps>[];
	const defaultIndex = Math.max(
		0,
		triggers.findIndex((node) => node.props.value === defaultValue),
	);

	return (
		<TabGroup defaultIndex={defaultIndex} className={cn("w-full", className)}>
			{list}
			<TabPanels>{panels}</TabPanels>
		</TabGroup>
	);
};

export const TabsList = ({ children, className }: TabsListProps) => (
	<TabList
		className={cn(
			"tabs tabs-box inline-flex flex-nowrap overflow-x-auto bg-base-200 p-1",
			className,
		)}
	>
		{children}
	</TabList>
);

export const TabsTrigger = ({ children, className }: TabsTriggerProps) => (
	<Tab
		className={cn(
			"tab whitespace-nowrap rounded-md text-base-content/70 data-selected:bg-base-100 data-selected:font-semibold data-selected:text-primary data-selected:shadow-sm focus-visible:outline-2 focus-visible:outline-primary",
			className,
		)}
	>
		{children}
	</Tab>
);

export const TabsContent = ({ children, className }: TabsContentProps) => (
	<TabPanel
		className={cn(
			"mt-2 focus-visible:outline-2 focus-visible:outline-primary",
			className,
		)}
	>
		{children}
	</TabPanel>
);
