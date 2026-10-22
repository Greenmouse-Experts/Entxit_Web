export interface Announcement {
	id: string;
	hostCommunityId: string;
	subadminId?: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
	reactions?: {
		likes: number;
		dislikes: number;
	};
	hostReaction?: "like" | "dislike" | null;
	isRead?: boolean;
}

export interface CreateAnnouncementDto {
	title: string;
	content: string;
}

export interface UpdateAnnouncementDto {
	title?: string;
	content?: string;
}
