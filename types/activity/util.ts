export type Diff<T> = { from: T; to: T };

export type InsertableActivityItemBase = {
	kind: string;
	communityId: string;
	actorId: string;
	collectionId?: string;
	pubId?: string;
	payload: Record<string, any>;
};
