import {
	IdIndex,
	CollectionPub,
	Collection,
	Community,
	Discussion,
	ExternalPublication,
	PubEdge,
	Pub,
	Release,
	Review,
	ThreadComment,
	Thread,
	User,
} from 'types';

import { ActivityItem } from '.';

export const activityAssociationTypes = [
	'collectionPubs',
	'collections',
	'communities',
	'discussions',
	'externalPublications',
	'pubEdges',
	'pubs',
	'reviews',
	'releases',
	'threadComments',
	'threads',
	'users',
] as const;

type AssociationRecord<T> = T extends Record<ActivityAssociationType, any> ? T : never;
type IdIndexes<T extends { [k: string]: any }> = { [k in keyof T]: IdIndex<T[k]> };

export type ActivityAssociationType = typeof activityAssociationTypes[number];
export type ActivityAssociationIds = Record<ActivityAssociationType, string[]>;

export type ActivityAssociations = AssociationRecord<
	IdIndexes<{
		collectionPubs: CollectionPub;
		collections: Collection;
		communities: Community;
		discussions: Discussion;
		externalPublications: ExternalPublication;
		pubEdges: PubEdge;
		pubs: Pub;
		releases: Release;
		reviews: Review;
		threadComments: ThreadComment;
		threads: Thread;
		users: User;
	}>
>;

export type ActivityItemsContext = {
	activityItems: ActivityItem[];
	associations: ActivityAssociations;
};
