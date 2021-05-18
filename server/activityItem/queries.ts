import {
	Pub as PubType,
	InsertableActivityItem,
	Collection as CollectionType,
	Community as CommunityType,
	Member as MemberType,
} from 'types';

import { Pub, ActivityItem, Collection, Member, Community } from 'server/models';

const createActivityItem = (ai: InsertableActivityItem) => ActivityItem.create(ai);

const getDiffsForPayload = (newEntry, oldEntry, keys) =>
	keys.reduce((memo, key) =>
		oldEntry[key] === newEntry[key]
			? memo
			: {
					...memo,
					[key]: {
						from: oldEntry[key],
						to: newEntry[key],
					},
			  },
	);

export const createPubActivityItem = async (
	kind: 'pub-created' | 'pub-updated' | 'pub-released' | 'pub-removed',
	userId: string,
	oldPub: PubType,
	communityId: string,
	pubId: string,
) => {
	const pub = Pub.findOne({ where: pubId });
	createActivityItem({
		kind,
		userId,
		communityId,
		payload: {
			pub: {
				title: pub.title,
			},
			...getDiffsForPayload(pub, oldPub, ['title', 'doi']),
		},
	});
};

export const createCommunityActivityItem = async (
	kind: 'community-created' | 'community-updated',
	userId: string,
	oldCommunity: CommunityType,
	communityId: string,
) => {
	const community = Community.findOne({ where: { id: communityId } });
	createActivityItem({
		userId,
		kind,
		communityId,
		payload: getDiffsForPayload(community, oldCommunity, ['title']),
	});
};

export const createMemberActivityItem = async (
	kind: 'member-created' | 'member-updated' | 'member-removed',
	userId: string,
	communityId: string,
	memberId: string,
	oldMember: MemberType,
) => {
	const member = await Member.findOne({ where: { id: userId } });
	const payloadDiffs = getDiffsForPayload(member, oldMember, ['permissions']);
	createActivityItem({
		kind,
		actorId: userId,
		communityId,
		payload: {
			userId: memberId,
			permissions: member.permissions,
			...payloadDiffs,
		},
	});
};

export const createCollectionActivityItem = async (
	kind: 'collection-created' | 'collection-updated' | 'collection-removed',
	collectionId: string,
	userId: string,
	communityId: string,
	oldCollection: CollectionType,
) => {
	const collection = await Collection.findOne({ where: { id: collectionId } });
	const { title } = collection;
	const payloadDiffs = getDiffsForPayload(collection, oldCollection, [
		'isPublic',
		'isRestricted',
		'title',
	]);
	createActivityItem({
		kind,
		collectionId,
		actorId: userId,
		communityId,
		payload: {
			collection: {
				title,
			},
			layout: true as const,
			metadata: true as const,
			...payloadDiffs,
		},
	});
};
