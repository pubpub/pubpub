import * as types from 'types';

import { Pub, ActivityItem, Collection, Member, Community, CollectionPub } from 'server/models';

const createActivityItem = (ai: types.InsertableActivityItem) => ActivityItem.create(ai);

const getDiffsForPayload = <
	Entry extends Record<string, any>,
	EntryKey extends keyof Entry,
	Diffs = Partial<{ [Key in EntryKey]: types.Diff<Entry[Key]> }>
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
	kind: 'pub-created' | 'pub-updated' | 'pub-removed' | 'pub-released',
	userId: string,
	oldPub: types.Pub,
	communityId: string,
	releaseId: string,
	pubId: string,
) => {
	const pub: types.Pub = Pub.findOne({ where: pubId });
	const diffs = getDiffsForPayload(pub, oldPub, ['title', 'doi']);
	if (kind === 'pub-created') {
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
	}
};

export const createCommunityActivityItem = async (
	kind: 'community-created' | 'community-updated',
	userId: string,
	oldCommunity: types.Community,
	communityId: string,
) => {
	const community: types.Community = Community.findOne({ where: { id: communityId } });
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
	oldMember: types.Member,
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

export const createCollectionPubActivityItem = async (
	kind: 'collection-pub-created' | 'collection-pub-removed',
	userId: string,
	communityId: string,
	collectionPubId: string,
) => {
	const collectionPub: types.DefinitelyHas<
		types.CollectionPub,
		'pub' | 'collection'
	> = await CollectionPub.findOne({
		where: { id: collectionPubId },
		includes: [
			{ model: Pub, as: 'pub' },
			{ model: Collection, as: 'collection' },
		],
	});
	createActivityItem({
		kind,
		pubId: collectionPub.pubId,
		collectionId: collectionPub.collectionId,
		actorId: userId,
		communityId,
		payload: {
			collectionPubId,
			pub: {
				title: collectionPub.pub.title,
			},
			collection: {
				title: collectionPub.collection.title,
			},
		},
	});
};

export const createCollectionActivityItem = async (
	kind: 'collection-created' | 'collection-updated' | 'collection-removed',
	collectionId: string,
	userId: string,
	communityId: string,
	oldCollection: types.Collection,
) => {
	const collection: types.Collection = await Collection.findOne({ where: { id: collectionId } });
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
