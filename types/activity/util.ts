export type InsertableActivityItemBase = {
	kind: string;
	communityId: string;
	actorId: string;
	collectionId?: string;
	pubId?: string;
};

export type ActivityItemsFetchResult = {
	activityItems: ActivityItem[];
	associations: ActivityAssociations;
};
