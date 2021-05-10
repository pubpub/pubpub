export type ScopeSummary = {
	collections: number;
	pubs: number;
	discussions: number;
	reviews: number;
};

type UserVisitBase = {
	id: string;
	communityId: string;
	updatedAt: string;
	userId: string;
};

type UserPubVisit = UserVisitBase & {
	collectionId: null;
	pubId: string;
};

type UserCollectionVisit = UserVisitBase & {
	collectionId: string;
	pubId: null;
};

export type UserScopeVisit = UserCollectionVisit | UserPubVisit;
