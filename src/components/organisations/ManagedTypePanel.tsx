import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ListFeedback } from "./ListFeedback";

interface NamedType { id: string; name: string }

export function ManagedTypePanel({
	title,
	description,
	queryKey,
	load,
	create,
	remove,
}: {
	title: string;
	description: string;
	queryKey: string;
	load: () => Promise<NamedType[]>;
	create: (name: string) => Promise<unknown>;
	remove: (id: string) => Promise<unknown>;
}) {
	const queryClient = useQueryClient();
	const [name, setName] = useState("");
	const query = useQuery({ queryKey: ["admin", queryKey], queryFn: load });
	const createMutation = useMutation({
		mutationFn: create,
		onSuccess: async () => { setName(""); toast.success(`${title} added`); await queryClient.invalidateQueries({ queryKey: ["admin", queryKey] }); },
		onError: () => toast.error(`Could not add ${title.toLowerCase()}`),
	});
	const deleteMutation = useMutation({
		mutationFn: remove,
		onSuccess: async () => { toast.success("Type deleted"); await queryClient.invalidateQueries({ queryKey: ["admin", queryKey] }); },
		onError: () => toast.error("Could not delete type"),
	});
	const types = query.data ?? [];
	return <section className="rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
		<h2 className="text-lg font-semibold">{title}</h2>
		<p className="mt-1 text-sm text-base-content/60">{description}</p>
		<form className="mt-5 flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); if (name.trim()) createMutation.mutate(name.trim()); }}>
			<input className="input input-bordered min-w-48 flex-1" aria-label={`New ${title.toLowerCase()} name`} placeholder="New type name" value={name} onChange={(event) => setName(event.target.value)} required />
			<button type="submit" className="btn btn-primary" disabled={!name.trim() || createMutation.isPending}><Plus aria-hidden="true" className="size-4" />Add type</button>
		</form>
		<div className="mt-4 divide-y divide-base-200">
			<ListFeedback loading={query.isLoading} error={query.isError} empty={types.length === 0}>
				{types.map((type) => <div key={type.id} className="flex items-center justify-between gap-3 py-3">
					<span className="font-medium">{type.name}</span>
					<button type="button" className="btn btn-ghost btn-sm text-error" aria-label={`Delete ${type.name}`} disabled={deleteMutation.isPending} onClick={() => { if (window.confirm(`Delete ${type.name}?`)) deleteMutation.mutate(type.id); }}><Trash2 aria-hidden="true" className="size-4" /></button>
				</div>)}
			</ListFeedback>
		</div>
	</section>;
}
