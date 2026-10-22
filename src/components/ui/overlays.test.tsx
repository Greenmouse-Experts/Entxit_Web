// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BottomSheet } from "./BottomSheet";
import { Modal, ModalBody, ModalHeader } from "./Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

describe("shared overlays and tabs", () => {
	it("closes a modal on Escape and exposes its title", async () => {
		const onClose = vi.fn();
		render(
			<Modal isOpen onClose={onClose}>
				<ModalHeader>Manage user</ModalHeader>
				<ModalBody>
					<button type="button">Save</button>
				</ModalBody>
			</Modal>,
		);

		expect(screen.getByRole("dialog", { name: "Manage user" })).toBeTruthy();
		fireEvent.keyDown(document.activeElement ?? document.body, {
			key: "Escape",
		});
		await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
	});

	it("labels a bottom sheet and closes from its button", () => {
		const onClose = vi.fn();
		render(
			<BottomSheet isOpen onClose={onClose} title="Visitor details">
				<p>Details</p>
			</BottomSheet>,
		);
		expect(
			screen.getByRole("dialog", { name: "Visitor details" }),
		).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: "Close sheet" }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("switches panels using accessible tabs", () => {
		render(
			<Tabs defaultValue="first">
				<TabsList>
					<TabsTrigger value="first">First</TabsTrigger>
					<TabsTrigger value="second">Second</TabsTrigger>
				</TabsList>
				<TabsContent value="first">First panel</TabsContent>
				<TabsContent value="second">Second panel</TabsContent>
			</Tabs>,
		);
		expect(screen.getByRole("tabpanel").textContent).toBe("First panel");
		fireEvent.click(screen.getByRole("tab", { name: "Second" }));
		expect(screen.getByRole("tabpanel").textContent).toBe("Second panel");
	});
});
