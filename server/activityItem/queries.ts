import {
	Pub as PubType,
	InsertableActivityItem,
	Collection as CollectionType,
	Community as CommunityType,
	Member as MemberType,
	Diff,
} from 'types';

import { Pub, ActivityItem, Collection, Member, Community } from 'server/models';

const createActivityItem = (ai: InsertableActivityItem) => ActivityItem.create(ai);

const getDiffsForPayload = <
	Entry extends Record<string, any>,
	EntryKey extends keyof Entry,
	Diffs = Partial<{ [Key in EntryKey]: Diff<Entry[Key]> }>
>(
	newEntry: Entry,
	oldEntry: Entry,
	keys: EntryKey[],
): Diffs => {
	return keys.reduce(
		(memo: Diffs, key: EntryKey) =>
			oldEntry[key] === newEntry[key]
				? memo
				: {
						...memo,
						[key]: {
							from: oldEntry[key],
							to: newEntry[key],
						},
				  },
		{} as Diffs,
	);
};

const getChangeFlagsForPayload = <
	Entry extends Record<string, any>,
	EntryKey extends keyof Entry,
	Flags = Partial<{ [Key in EntryKey]: true }>
>(
	newEntry: Entry,
	oldEntry: Entry,
	keys: EntryKey[],
): Flags => {
	return keys.reduce(
		(memo: Flags, key: EntryKey) =>
			oldEntry[key] === newEntry[key] ? memo : { ...memo, [key]: true },
		{} as Flags,
	);
};

export const createPubActivityItem = async (
	kind: 'pub-created' | 'pub-updated' | 'pub-removed',
	userId: string,
	oldPub: PubType,
	communityId: string,
	pubId: string,
) => {
	const pub: PubType = Pub.findOne({ where: pubId });
	const diffs = getDiffsForPayload(pub, oldPub, ['title', 'doi']);
	createActivityItem({
		kind,
		actorId: userId,
		communityId,
		pubId: pub.id,
		payload: {
			...diffs,
			pub: {
				title: pub.title,
			},
		},
	});
};

export const createCommunityActivityItem = async (
	kind: 'community-created' | 'community-updated',
	userId: string,
	oldCommunity: CommunityType,
	communityId: string,
) => {
	const community: CommunityType = Community.findOne({ where: { id: communityId } });
	const diffs = getDiffsForPayload(community, oldCommunity, ['title']);
	createActivityItem({
		actorId: userId,
		kind,
		communityId,
		payload: {
			...diffs,
			community: {
				title: community.title,
			},
		},
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
	const diffs = getDiffsForPayload(member, oldMember, ['permissions']);
	createActivityItem({
		kind,
		actorId: userId,
		communityId,
		payload: {
			userId: memberId,
			permissions: member.permissions,
			...diffs,
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
	const collection: CollectionType = await Collection.findOne({ where: { id: collectionId } });
	const { title } = collection;
	const diffs = getDiffsForPayload(collection, oldCollection, [
		'isPublic',
		'isRestricted',
		'title',
	]);
	const flags = getChangeFlagsForPayload(collection, oldCollection, ['layout', 'metadata']);
	createActivityItem({
		kind,
		collectionId,
		actorId: userId,
		communityId,
		payload: {
			collection: {
				title,
			},
			...flags,
			...diffs,
		},
	});
};
