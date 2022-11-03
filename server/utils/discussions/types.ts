type SharedThreadProperties = {
	accessHash;
	user;
	body: {
		parentId: string;
		threadId: string;
		pubId: string;
		communityId: string;
		content: string;
		text: string;
		commentAccessHash: string;
		commenterName: string;
		isNewThread: boolean;
		accessHash: string;
	};
};

export type NewDiscussion = SharedThreadProperties & {
	body: { discussionId?; historyKey?; initAnchorData?; visibilityAccess? };
};

export type NewThreadComment = SharedThreadProperties & {
	body: { threadCommentId?: string | null };
};

export type Request = NewDiscussion & NewThreadComment;

export type RequestIds = {
	user: any;
	parentId: any;
	threadId: any;
	threadCommentId: string | null;
	pubId: any;
	communityId: any;
	accessHash: any;
	commentAccessHash: any;
	visibilityAccess: any;
	discussionId: any;
	isNewThread: boolean;
};
