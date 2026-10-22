// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PopUp from "./pop-up";

vi.mock("@tanstack/react-router", () => ({ useNavigate: () => vi.fn() }));

afterEach(cleanup);

describe("row actions", () => {
	it("shows available actions and disables actions that need a missing ID", () => {
		const openHosts = vi.fn();
		const deleteCommunity = vi.fn();
		function ActionMenu() {
			const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
			return (
				<PopUp
					itemIndex={0}
					currentIndex={selectedIndex}
					setIndex={setSelectedIndex}
					item={{ hostCommunityName: "Oak Park" }}
					actions={[
						{ key: "hosts", label: "Hosts", action: openHosts },
						{
							key: "delete",
							label: "Delete",
							action: deleteCommunity,
							disable_event: (community) => !("id" in community),
						},
					]}
				/>
			);
		}

		render(<ActionMenu />);
		fireEvent.click(screen.getByRole("button", { name: "Open row actions" }));
		expect(screen.getByRole("button", { name: "Hosts" })).toBeTruthy();
		expect(
			screen.getByRole<HTMLButtonElement>("button", { name: "Delete" })
				.disabled,
		).toBe(true);
		fireEvent.click(screen.getByRole("button", { name: "Hosts" }));
		expect(openHosts).toHaveBeenCalledOnce();
		expect(deleteCommunity).not.toHaveBeenCalled();
		expect(screen.queryByRole("button", { name: "Hosts" })).toBeNull();
	});
});
