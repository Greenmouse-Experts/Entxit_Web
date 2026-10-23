import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, X } from "lucide-react";
import { type FormEvent, useDeferredValue, useState } from "react";
import { toast } from "sonner";
import { useCommunityDetails } from "@/components/community/CommunityDetailsContext";
import PageLoader from "@/components/layout/PageLoader";
import CustomTable, { type columnType } from "@/components/tables/CustomTable";
import type { Actions } from "@/components/tables/pop-up";
import { extract_message } from "@/lib/api-error";
import { pageSizeParam, positiveInt, textParam } from "@/lib/url-search";
import { announcementsService } from "@/services/announcements.service";
import type { Announcement } from "@/services/types";

type AnnouncementsSearch = {
	q?: string;
	page?: number;
	pageSize?: number;
};

export const Route = createFileRoute(
	"/community/community/$communityId/announcements/",
)({
	validateSearch: (search: Record<string, unknown>): AnnouncementsSearch => ({
		q: textParam(search.q),
		page: positiveInt(search.page, 1),
		pageSize: pageSizeParam(search.pageSize),
	}),
	component: AnnouncementsPage,
});

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

function AnnouncementsPage() {
	const community = useCommunityDetails();
	const { q = "", page = 1, pageSize = 10 } = Route.useSearch();
	const navigate = Route.useNavigate();
	const queryClient = useQueryClient();
	const deferredQuery = useDeferredValue(q);
	const [editing, setEditing] = useState<Announcement | "new" | null>(null);
	const [deleting, setDeleting] = useState<Announcement | null>(null);
	const announcementsQuery = useQuery({
		queryKey: ["announcements", community.id, page, pageSize, deferredQuery],
		queryFn: () =>
			announcementsService.getCommunityAnnouncements(community.id, {
				page,
				limit: pageSize,
				q: deferredQuery || undefined,
			}),
	});
	const save = useMutation({
		mutationFn: async ({
			id,
			title,
			content,
		}: {
			id?: string;
			title: string;
			content: string;
		}) => {
			if (id)
				await announcementsService.updateAnnouncement(id, { title, content });
			else
				await announcementsService.createAnnouncement(community.id, {
					title,
					content,
				});
		},
		onSuccess: async (_, variables) => {
			setEditing(null);
			toast.success(
				variables.id ? "Announcement updated" : "Announcement published",
			);
			await queryClient.invalidateQueries({
				queryKey: ["announcements", community.id],
			});
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});
	const remove = useMutation({
		mutationFn: (id: string) => announcementsService.deleteAnnouncement(id),
		onSuccess: async () => {
			setDeleting(null);
			toast.success("Announcement deleted");
			await queryClient.invalidateQueries({
				queryKey: ["announcements", community.id],
			});
		},
		onError: (error: unknown) => toast.error(extract_message(error)),
	});
	const columns: columnType<Announcement>[] = [
		{
			key: "title",
			label: "Announcement",
			render: (_, item) => (
				<div className="min-w-56 max-w-lg">
					<p className="font-semibold">{item.title}</p>
					<p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-base-content/70">
						{item.content}
					</p>
				</div>
			),
		},
		{
			key: "createdAt",
			label: "Published",
			render: (_, item) =>
				item.createdAt ? dateFormatter.format(new Date(item.createdAt)) : "—",
		},
		{
			key: "reactions",
			label: "Reactions",
			render: (_, item) =>
				item.reactions
					? `${item.reactions.likes} likes · ${item.reactions.dislikes} dislikes`
					: "—",
		},
	];
	const actions: Actions<Announcement>[] = [
		{ key: "edit", label: "Edit", action: (item) => setEditing(item) },
		{ key: "delete", label: "Delete", action: (item) => setDeleting(item) },
	];

	return (
		<div className="space-y-7">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight ">
						Announcements
					</h1>
					<p className="max-w-2xl text-sm leading-6 text-base-content/70 sm:text-base">
						Keep everyone in {community.name} informed with news and notices.
					</p>
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<label className="input input-bordered flex w-full items-center gap-2 bg-base-100 sm:w-80">
					<Search aria-hidden="true" className="size-4 text-base-content/60" />
					<input
						aria-label="Search announcements"
						placeholder="Search announcements"
						className="min-w-0 grow"
						value={q}
						onChange={(event) =>
							navigate({
								search: (prev) => ({
									...prev,
									q: event.target.value || undefined,
									page: 1,
								}),
								replace: true,
							})
						}
					/>
				</label>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setEditing("new")}
				>
					<Plus aria-hidden="true" className="size-4" /> New announcement
				</button>
			</div>
			<PageLoader
				query={announcementsQuery}
				loadingText="Loading announcements..."
			>
				{(response) => {
					const payload = response.payload;
					const rows = payload.data;
					return (
						<CustomTable
							data={rows}
							columns={columns}
							actions={actions}
							caption={`${community.name} announcements`}
							emptyMessage={
								q
									? "No announcements match this search."
									: "No announcements published yet."
							}
							totalCount={
								payload.pagination?.total ?? payload.total ?? rows.length
							}
							paginationProps={{
								page,
								pageSize,
								totalPages: payload.pagination?.pages ?? payload.pages,
								setPagination: (nextPage, nextSize) =>
									navigate({
										search: (prev) => ({
											...prev,
											page: nextPage,
											pageSize: nextSize ?? prev.pageSize,
										}),
										replace: true,
									}),
							}}
						/>
					);
				}}
			</PageLoader>
			<AnnouncementEditor
				key={editing === "new" ? "new" : (editing?.id ?? "closed")}
				item={editing}
				pending={save.isPending}
				onClose={() => setEditing(null)}
				onSave={(title, content) =>
					save.mutate({
						id: editing && editing !== "new" ? editing.id : undefined,
						title,
						content,
					})
				}
			/>
			<Dialog
				open={deleting !== null}
				onClose={() => setDeleting(null)}
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-neutral/55" />
				<div className="fixed inset-0 flex items-center justify-center p-4">
					<DialogPanel className="w-full max-w-md rounded-box bg-base-100 p-6 shadow-xl">
						<DialogTitle className="text-xl font-semibold">
							Delete announcement?
						</DialogTitle>
						<p className="mt-2 text-sm text-base-content/70">
							{deleting?.title} will be removed from this community.
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={() => setDeleting(null)}
								disabled={remove.isPending}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-error"
								onClick={() => deleting && remove.mutate(deleting.id)}
								disabled={remove.isPending}
							>
								{remove.isPending ? (
									<span className="loading loading-spinner loading-sm" />
								) : (
									"Delete"
								)}
							</button>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</div>
	);
}

function AnnouncementEditor({
	item,
	pending,
	onClose,
	onSave,
}: {
	item: Announcement | "new" | null;
	pending: boolean;
	onClose: () => void;
	onSave: (title: string, content: string) => void;
}) {
	const [title, setTitle] = useState(item && item !== "new" ? item.title : "");
	const [content, setContent] = useState(
		item && item !== "new" ? item.content : "",
	);
	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (title.trim() && content.trim()) onSave(title.trim(), content.trim());
	}
	return (
		<Dialog open={item !== null} onClose={onClose} className="relative z-50">
			<DialogBackdrop className="fixed inset-0 bg-neutral/55" />
			<div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
				<DialogPanel className="w-full max-w-xl rounded-box bg-base-100 p-6 shadow-xl sm:p-8">
					<div className="flex items-start justify-between gap-4">
						<div>
							<DialogTitle className="text-xl font-semibold">
								{item === "new" ? "New announcement" : "Edit announcement"}
							</DialogTitle>
							<p className="mt-1 text-sm text-base-content/70">
								This notice will appear in the community feed.
							</p>
						</div>
						<button
							type="button"
							className="btn btn-ghost btn-sm btn-square"
							aria-label="Close editor"
							onClick={onClose}
							disabled={pending}
						>
							<X aria-hidden="true" className="size-4" />
						</button>
					</div>
					<form onSubmit={submit} className="mt-6 space-y-5">
						<label className="block space-y-2 text-sm font-medium">
							Title
							<input
								className="input input-bordered w-full"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								maxLength={150}
								required
								disabled={pending}
							/>
						</label>
						<label className="block space-y-2 text-sm font-medium">
							Message
							<textarea
								className="textarea textarea-bordered min-h-44 w-full"
								value={content}
								onChange={(event) => setContent(event.target.value)}
								required
								disabled={pending}
							/>
						</label>
						<div className="flex justify-end gap-2">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={onClose}
								disabled={pending}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={pending || !title.trim() || !content.trim()}
							>
								{pending ? (
									<span className="loading loading-spinner loading-sm" />
								) : item === "new" ? (
									"Publish announcement"
								) : (
									"Save changes"
								)}
							</button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
