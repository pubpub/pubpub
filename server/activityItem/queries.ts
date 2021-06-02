import * as types from 'types';
import {
	Collection,
	Member,
	Community,
	PubEdge,
	Discussion,
	ExternalPublication,
	ReviewNew,
	Pub,
	CollectionPub,
	ThreadComment,
	Thread,
} from 'server/models';

import { getDiffsForPayload, getChangeFlagsForPayload, createActivityItem } from './utils';

const resolvePartialMemberItem = async (member: types.Member) => {
	if ('pubId' in member) {
		const pub: types.Pub = await Pub.findOne({ where: { id: member.pubId } });
		return {
			tag: 'pub',
			value: {
				communityId: pub.communityId,
				pubId: pub.id,
				payload: {
					pub: {
						title: pub.title,
					},
				},
			},
		} as const;
	}
	if ('collectionId' in member) {
		const collection: types.Collection = await Collection.findOne({
			where: { id: member.collectionId },
		});
		return {
			tag: 'collection',
			value: {
				communityId: collection.communityId,
				collectionId: collection.id,
				payload: {
					collection: {
						title: collection.title,
					},
				},
			},
		} as const;
	}
	if ('communityId' in member) {
		const community: types.Community = await Community.findOne({
			where: { id: member.communityId },
		});
		return {
			tag: 'community',
			value: {
				communityId: community.id,
				payload: {
					community: {
						title: community.title,
					},
				},
			},
		} as const;
	}
	throw new Error('Invalid Member');
};

export const createCommunityActivityItem = async (
	kind: 'community-created' | 'community-updated',
	actorId: string,
	oldCommunity: types.Community,
	communityId: string,
) => {
	const community: types.Community = await Community.findOne({ where: { id: communityId } });
	const diffs = getDiffsForPayload(community, oldCommunity, ['title']);
	return createActivityItem({
		actorId,
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

export const createMemberCreatedActivityItem = async (actorId: string, memberId: string) => {
	const member = await Member.findOne({ where: { id: memberId } });
	const partial = await resolvePartialMemberItem(member);
	const item = {
		kind: 'member-created' as const,
		actorId,
		payload: {
			userId: member.userId,
			permissions: member.permissions,
		},
	};
	if (partial.tag === 'pub') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'collection') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'community') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	throw new Error('Invalid Scope');
};

export const createMemberRemovedActivityItem = async (actorId: string, memberId: string) => {
	const member = await Member.findOne({ where: { id: memberId } });
	const partial = await resolvePartialMemberItem(member);
	const item = {
		kind: 'member-removed' as const,
		actorId,
		payload: {
			userId: member.userId,
		},
	};
	if (partial.tag === 'pub') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'collection') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'community') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	throw new Error('Invalid Scope');
};

export const createMemberUpdatedActivityItem = async (
	scope: types.Scope,
	actorId: string,
	memberId: string,
	oldMember: types.Member,
) => {
	const member: types.Member = await Member.findOne({ where: { id: memberId } });
	const partial = await resolvePartialMemberItem(member);
	const diffs = getDiffsForPayload(member, oldMember, ['permissions']);
	const item = {
		kind: 'member-updated' as const,
		actorId,
		communityId: scope.communityId,
		payload: {
			userId: member.userId,
			...diffs,
		},
	};
	if (partial.tag === 'pub') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'collection') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	if (partial.tag === 'community') {
		const { payload, ...rest } = partial.value;
		return createActivityItem({
			...item,
			...rest,
			payload: { ...item.payload, ...payload },
		});
	}
	throw new Error('Invalid Scope');
};

export const createCollectionActivityItem = async (
	kind: 'collection-created' | 'collection-updated' | 'collection-removed',
	collectionId: string,
	actorId: string,
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
	return createActivityItem({
		kind,
		collectionId,
		actorId,
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

export const createPubReviewCreatedActivityItem = async (
	kind: 'pub-review-created' | 'pub-review-comment-added',
	actorId: string,
	communityId: string,
	reviewId: string,
	isReply: boolean,
) => {
	const review: types.DefinitelyHas<types.Review, 'thread'> = await ReviewNew.findOne({
		where: { id: reviewId },
		includes: [
			{ model: Thread, as: 'thread', includes: [{ model: ThreadComment, as: 'comments' }] },
		],
	});
	const threadComment: types.ThreadComment = review.thread.comments[0];
	const pub: types.Pub = await Pub.findOne({ where: { id: review.pubId } });
	return createActivityItem({
		communityId,
		actorId,
		kind,
		pubId: pub.id,
		payload: {
			reviewId,
			threadId: review.threadId,
			isReply,
			threadComment: {
				id: threadComment.id,
				text: threadComment.text,
				userId: actorId,
			},
			pub: { title: pub.title },
		},
	});
};

export const createPubReviewUpdatedActivityItem = async (
	kind: 'pub-review-updated',
	actorId: string,
	communityId: string,
	reviewId: string,
	oldReview: types.Review,
) => {
	const review: types.Review = await ReviewNew.findOne({ where: { id: reviewId } });
	const pub: types.Pub = await Pub.findOne({ where: { id: review.pubId } });
	const diffs = getDiffsForPayload(review, oldReview, ['status']);
	return createActivityItem({
		kind,
		pubId: pub.id,
		actorId,
		communityId,
		payload: {
			...diffs,
			pub: {
				title: pub.title,
			},
			reviewId,
		},
	});
};

export const createCollectionPubActivityItem = async (
	kind: 'collection-pub-created' | 'collection-pub-removed',
	actorId: string,
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
	return createActivityItem({
		kind,
		pubId: collectionPub.pubId,
		collectionId: collectionPub.collectionId,
		actorId,
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

export const createPubActivityItem = async (
	kind: 'pub-created' | 'pub-updated' | 'pub-removed',
	actorId: string,
	oldPub: types.Pub,
	communityId: string,
	pubId: string,
) => {
	const pub: types.Pub = await Pub.findOne({ where: pubId });
	const diffs = kind === 'pub-updated' && getDiffsForPayload(pub, oldPub, ['title', 'doi']);
	return createActivityItem({
		kind,
		actorId,
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

export const createPubReleaseActivityItem = async (
	kind: 'pub-released',
	actorId: string,
	communityId: string,
	releaseId: string,
	pubId: string,
) => {
	const pub: types.Pub = await Pub.findOne({ where: pubId });
	return createActivityItem({
		kind,
		actorId,
		communityId,
		pubId: pub.id,
		payload: {
			releaseId,
			pub: {
				title: pub.title,
			},
		},
	});
};

export const createPubEdgeActivityItem = async (
	kind: 'pub-edge-created' | 'pub-edge-removed',
	actorId: string,
	pubEdgeId: string,
	communityId: string,
) => {
	const pubEdge: types.DefinitelyHas<types.PubEdge, 'pub'> &
		types.DefinitelyHas<
			types.PubEdge,
			'targetPub' | 'externalPublication'
		> = await PubEdge.findOne({
		where: { id: pubEdgeId },
		includes: [
			{ model: Pub, as: 'pub' },
			{ model: ExternalPublication, as: 'externalPublication' },
		],
	});
	const isExternalEdge = !!pubEdge.externalPublicationId!!;
	const target = isExternalEdge
		? {
				externalPublication: {
					id: pubEdge.externalPublication.id,
					title: pubEdge.externalPublication.title,
					url: pubEdge.externalPublication.url,
				},
		  }
		: {
				pub: {
					id: pubEdge.pubId,
					title: pubEdge.pub.title,
					slug: pubEdge.pub.slug,
				},
		  };
	return createActivityItem({
		kind,
		actorId,
		communityId,
		pubId: pubEdge.pubId,
		payload: {
			pub: {
				title: pubEdge.pub.title,
			},
			pubEdgeId,
			target,
		},
	});
};

export const createPubDiscussionActivityItem = async (
	kind: 'pub-discussion-comment-added',
	actorId: string,
	communityId: string,
	isReply: boolean,
	pubId: string,
	discussionId: string,
	threadCommentId: string,
) => {
	const pub: types.Pub = await Pub.findOne({ where: { id: pubId } });
	const threadComment: types.ThreadComment = await ThreadComment.findOne({
		where: { id: threadCommentId },
	});
	const discussion: types.DefinitelyHas<types.Discussion, 'thread'> = await Discussion.findOne({
		where: { id: discussionId },
	});
	return createActivityItem({
		kind,
		pubId,
		actorId,
		communityId,
		payload: {
			pub: {
				title: pub.title,
			},
			discussionId,
			threadId: discussion.threadId,
			isReply,
			threadComment: {
				id: threadCommentId,
				text: threadComment.text,
				userId: actorId,
			},
		},
	});
};
