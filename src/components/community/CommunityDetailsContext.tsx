import { createContext, type ReactNode, useContext } from "react";
import type { SubadminCommunity } from "@/services/types";

const CommunityDetailsContext = createContext<SubadminCommunity | null>(null);

export function CommunityDetailsProvider({
	community,
	children,
}: {
	community: SubadminCommunity;
	children: ReactNode;
}) {
	return (
		<CommunityDetailsContext.Provider value={community}>
			{children}
		</CommunityDetailsContext.Provider>
	);
}

export function useCommunityDetails() {
	const community = useContext(CommunityDetailsContext);
	if (!community) {
		throw new Error(
			"Community details are unavailable outside the community layout",
		);
	}
	return community;
}
