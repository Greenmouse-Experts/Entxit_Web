import type { SubadminCommunity } from "@/services/types";

export const demoCommunities = [
	{
		id: "oakwood-estate",
		name: "Oakwood Estate",
		hostCategoryName: "Residential Estate",
		address: "18 Palm Avenue, Lekki",
		state: "Lagos",
		description:
			"A residential community with shared facilities and a dedicated security team.",
		status: "active",
		totalMembers: 248,
		totalGuards: 12,
	},
	{
		id: "riverside-complex",
		name: "Riverside Complex",
		hostCategoryName: "Mixed-Use Estate / Complex",
		address: "4 Riverside Drive, Maitama",
		state: "Abuja",
		description: "A mixed-use complex with residential and commercial spaces.",
		status: "active",
		totalMembers: 136,
		totalGuards: 8,
	},
] satisfies SubadminCommunity[];
