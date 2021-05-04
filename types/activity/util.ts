export type Diff<T> = { from: T; to: T };

export type ActivityItemBase = {
	id: string;
	createdAt: string;
	updatedAt: string;
	kind: string;
	communityId: string;
	actorId: string;
	collectionId?: string;
	pubId?: string;
	payload: Record<string, any>;
};
