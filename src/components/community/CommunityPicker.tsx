import type { SubadminCommunity } from "@/services/types";

interface CommunityPickerProps {
	communities: SubadminCommunity[];
	selectedId: string;
	onSelect: (id: string) => void;
}

export function CommunityPicker({
	communities,
	selectedId,
	onSelect,
}: CommunityPickerProps) {
	if (communities.length < 2) return null;

	return (
		<label className="flex min-w-52 flex-col gap-1.5 text-xs font-medium text-base-content/70">
			Community
			<select
				className="select select-bordered w-full bg-base-100 text-sm text-base-content"
				value={selectedId}
				onChange={(event) => onSelect(event.target.value)}
			>
				{communities.map((community) => (
					<option key={community.id} value={community.id}>
						{community.name}
					</option>
				))}
			</select>
		</label>
	);
}
