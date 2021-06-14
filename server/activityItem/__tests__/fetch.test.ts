/* global describe, it, expect, beforeEach, beforeAll, afterAll */
import { modelize, setup, teardown } from 'stubstub';

import { ActivityAssociations, ActivityAssociationType } from 'types';
import { ActivityItem } from 'server/models';

import { fetchActivityItems } from '../fetch';
import {
	createMemberCreatedActivityItem,
	createMemberUpdatedActivityItem,
	createMemberRemovedActivityItem,
	createCollectionActivityItem,
	createCollectionPubActivityItem,
	createCollectionUpdatedActivityItem,
	createPubReviewCreatedActivityItem,
	createPubReviewCommentAddedActivityItem,
	createPubReviewUpdatedActivityItem,
	createCommunityCreatedActivityItem,
	createCommunityUpdatedActivityItem,
	createPubActivityItem,
	createPubUpdatedActivityItem,
	createPubReleasedActivityItem,
} from '../queries';

const models = modelize`
	User actor {}
	User loudmouth {}
	Member pubMember {
		user: actor
		permissions: "admin"
		pub: pub
	}
	Member collectionMember {
		user: actor
		permissions: "admin"
		collection: collection
	}
	Member communityMember {
		user: actor
		permissions: "admin"
		community: community
	}
	Community community {
		Collection collection {
			CollectionPub collectionPub {
				rank: "0"
				Pub pub {
					Release release {
						createdAt: "2021-01-01"
						historyKey: 1
					}
					ReviewNew review {
						author: actor
						status: "open"
						number: 7
						visibility: Visibility {}
						Thread thread {
							ThreadComment releaseRequestComment {
								author: actor
								text: "Release me to the world!"
								createdAt: "2017-10-11 00:26:09.571+00"
							}
							ThreadComment releaseDenialComment {
								author: loudmouth
								text: "You're not ready yet, kid."
								createdAt: "2040-10-11 00:26:09.571+00"
							}
						}
					}
				}
			}
		}
	}
`;

setup(beforeAll, models.resolve);
teardown(afterAll);

beforeEach(() => ActivityItem.destroy({ where: {}, truncate: true }));

const expectAssociationIds = (
	associations: ActivityAssociations,
	ids: Partial<Record<ActivityAssociationType, string[]>>,
) => {
	Object.keys(ids).forEach((type) => {
		const idsOfType = ids[type as ActivityAssociationType]!;
		const associationsOfType = associations[type as ActivityAssociationType];
		idsOfType.forEach((id) => expect(associationsOfType[id]?.id).toEqual(id));
	});
};

describe('fetchActivityItems', () => {
	it('fetches items for community-created and community-updated', async () => {
		const { actor, community } = models;
		await createCommunityCreatedActivityItem(actor.id, community.id);
		await createCommunityUpdatedActivityItem(actor.id, community.id, {
			...community,
			title: 'Oooh ahh',
		});
		const {
			activityItems: [updatedItem, createdItem],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id },
		});
		expect(createdItem).toMatchObject({
			kind: 'community-created',
			payload: { community: { title: community.title } },
		});
		expect(updatedItem).toMatchObject({
			kind: 'community-updated',
			payload: {
				community: { title: community.title },
				title: { from: 'Oooh ahh', to: community.title },
			},
		});
		expectAssociationIds(associations, { community: [community.id], user: [actor.id] });
	});

	it('fetches items for member-created, member-updated, and member-removed across pub, collection, and community membership', async () => {
		const {
			actor,
			pub,
			collection,
			community,
			pubMember,
			collectionMember,
			communityMember,
		} = models;
		await createMemberCreatedActivityItem(actor.id, pubMember.id);
		await createMemberUpdatedActivityItem(actor.id, pubMember.id, {
			...pubMember,
			permissions: 'edit',
		});
		await createMemberRemovedActivityItem(actor.id, pubMember.id);
		await createMemberCreatedActivityItem(actor.id, collectionMember.id);
		await createMemberUpdatedActivityItem(actor.id, collectionMember.id, {
			...collectionMember,
			permissions: 'edit',
		});
		await createMemberRemovedActivityItem(actor.id, collectionMember.id);
		await createMemberCreatedActivityItem(actor.id, communityMember.id);
		await createMemberUpdatedActivityItem(actor.id, communityMember.id, {
			...communityMember,
			permissions: 'edit',
		});
		await createMemberRemovedActivityItem(actor.id, communityMember.id);
		const {
			activityItems: [
				communityMemberRemovedItem,
				communityMemberUpdatedItem,
				communityMemberCreatedItem,
				collectionMemberRemovedItem,
				collectionMemberUpdatedItem,
				collectionMemberCreatedItem,
				pubMemberRemovedItem,
				pubMemberUpdatedItem,
				pubMemberCreatedItem,
			],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id },
		});
		expect(pubMemberCreatedItem).toMatchObject({
			kind: 'member-created',
			payload: {
				userId: pubMember.userId,
				permissions: pubMember.permissions,
			},
		});
		expect(pubMemberUpdatedItem).toMatchObject({
			kind: 'member-updated',
			payload: {
				userId: pubMember.userId,
				permissions: {
					from: 'edit',
					to: pubMember.permissions,
				},
			},
		});
		expect(pubMemberRemovedItem).toMatchObject({
			kind: 'member-removed',
			payload: {
				userId: pubMember.userId,
			},
		});
		expect(collectionMemberCreatedItem).toMatchObject({
			kind: 'member-created',
			payload: {
				userId: collectionMember.userId,
				permissions: collectionMember.permissions,
			},
		});
		expect(collectionMemberUpdatedItem).toMatchObject({
			kind: 'member-updated',
			payload: {
				userId: collectionMember.userId,
				permissions: {
					from: 'edit',
					to: collectionMember.permissions,
				},
			},
		});
		expect(collectionMemberRemovedItem).toMatchObject({
			kind: 'member-removed',
			payload: {
				userId: collectionMember.userId,
			},
		});
		expect(communityMemberCreatedItem).toMatchObject({
			kind: 'member-created',
			payload: {
				userId: communityMember.userId,
				permissions: communityMember.permissions,
			},
		});
		expect(communityMemberUpdatedItem).toMatchObject({
			kind: 'member-updated',
			payload: {
				userId: communityMember.userId,
				permissions: {
					from: 'edit',
					to: communityMember.permissions,
				},
			},
		});
		expect(communityMemberRemovedItem).toMatchObject({
			kind: 'member-removed',
			payload: {
				userId: communityMember.userId,
			},
		});
		expectAssociationIds(associations, {
			collection: [collection.id],
			community: [community.id],
			pub: [pub.id],
			user: [actor.id],
		});
	});

	it('fetches items for collection-created, collection-updated, and collection-removed', async () => {
		const { community, collection, actor } = models;
		await createCollectionActivityItem('collection-created', actor.id, collection.id);
		await createCollectionUpdatedActivityItem(actor.id, collection.id, {
			...collection,
			isPublic: true,
		});
		await createCollectionActivityItem('collection-removed', actor.id, collection.id);
		const {
			activityItems: [removedItem, updatedItem, createdItem],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id, collectionId: collection.id },
		});
		expect(createdItem).toMatchObject({
			kind: 'collection-created',
			payload: { collection: { title: collection.title } },
		});
		expect(updatedItem).toMatchObject({
			kind: 'collection-updated',
			payload: { isPublic: { from: true, to: false } },
		});
		expect(removedItem).toMatchObject({
			kind: 'collection-removed',
			payload: { collection: { title: collection.title } },
		});
		expectAssociationIds(associations, {
			community: [community.id],
			collection: [collection.id],
			user: [actor.id],
		});
	});

	it('fetches items for pub-created, pub-updated, pub-removed, and pub-released', async () => {
		const { community, pub, actor, release } = models;
		await createPubActivityItem('pub-created', actor.id, pub.id);
		await createPubUpdatedActivityItem(actor.id, pub.id, { ...pub, doi: 'some/old/doi' });
		await createPubActivityItem('pub-removed', actor.id, pub.id);
		await createPubReleasedActivityItem(actor.id, release.id);
		const {
			activityItems: [releasedItem, removedItem, updatedItem, createdItem],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id, pubId: pub.id },
		});
		expect(createdItem).toMatchObject({
			kind: 'pub-created',
			payload: { pub: { title: pub.title } },
		});
		expect(updatedItem).toMatchObject({
			kind: 'pub-updated',
			payload: {
				pub: { title: pub.title },
				doi: { from: 'some/old/doi', to: null },
			},
		});
		expect(removedItem).toMatchObject({
			kind: 'pub-removed',
			payload: { pub: { title: pub.title } },
		});
		expect(releasedItem).toMatchObject({
			kind: 'pub-released',
			payload: {
				pub: {
					title: pub.title,
				},
				releaseId: release.id,
			},
		});
		expectAssociationIds(associations, {
			community: [community.id],
			pub: [pub.id],
			user: [actor.id],
		});
	});

	it('fetches items for collection-pub-created and collection-pub-removed', async () => {
		const { community, collectionPub, pub, collection, actor } = models;
		await createCollectionPubActivityItem('collection-pub-created', actor.id, collectionPub.id);
		await createCollectionPubActivityItem('collection-pub-removed', actor.id, collectionPub.id);
		const {
			activityItems: [removedItem, createdItem],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id, collectionId: collection.id },
		});
		expect(removedItem).toMatchObject({
			kind: 'collection-pub-removed',
			pubId: pub.id,
			collectionId: collection.id,
			payload: {
				collectionPubId: collectionPub.id,
				pub: {
					title: pub.title,
				},
				collection: {
					title: collection.title,
				},
			},
		});
		expect(createdItem).toMatchObject({
			kind: 'collection-pub-created',
			pubId: pub.id,
			collectionId: collection.id,
			payload: {
				collectionPubId: collectionPub.id,
				pub: {
					title: pub.title,
				},
				collection: {
					title: collection.title,
				},
			},
		});
		expectAssociationIds(associations, {
			community: [community.id],
			collection: [collection.id],
			collectionPub: [collectionPub.id],
			pub: [pub.id],
			user: [actor.id],
		});
	});
	it('fetches items for pub-review-created, pub-review-comment-added, and pub-review-updated', async () => {
		const {
			actor,
			loudmouth,
			community,
			review,
			pub,
			thread,
			releaseRequestComment,
			releaseDenialComment,
		} = models;
		await createPubReviewCreatedActivityItem(review.id);
		await createPubReviewCommentAddedActivityItem(review.id, releaseDenialComment.id);
		await createPubReviewUpdatedActivityItem(
			'pub-review-updated',
			actor.id,
			community.id,
			review.id,
			{
				...review,
				status: 'closed',
			},
		);
		const {
			activityItems: [updatedItem, commentAddedItem, createdItem],
			associations,
		} = await fetchActivityItems({
			scope: { communityId: community.id, pubId: pub.id },
		});
		expect(createdItem).toMatchObject({
			actorId: actor.id,
			communityId: community.id,
			kind: 'pub-review-created',
			pubId: pub.id,
			payload: {
				isReply: false,
				threadId: thread.id,
				threadComment: {
					id: releaseRequestComment.id,
					text: releaseRequestComment.text,
					userId: actor.id,
				},
				reviewId: review.id,
				pub: { title: pub.title },
			},
		});
		expect(commentAddedItem).toMatchObject({
			actorId: loudmouth.id,
			communityId: community.id,
			kind: 'pub-review-comment-added',
			pubId: pub.id,
			payload: {
				isReply: true,
				threadId: thread.id,
				threadComment: {
					id: releaseDenialComment.id,
					text: releaseDenialComment.text,
					userId: loudmouth.id,
				},
				reviewId: review.id,
				pub: { title: pub.title },
			},
		});
		expect(updatedItem).toMatchObject({
			actorId: actor.id,
			communityId: community.id,
			kind: 'pub-review-updated',
			pubId: pub.id,
			payload: {
				reviewId: review.id,
				pub: { title: pub.title },
				status: {
					from: 'closed',
					to: review.status,
				},
			},
		});
		expectAssociationIds(associations, {
			community: [community.id],
			pub: [pub.id],
			user: [actor.id, loudmouth.id],
			review: [review.id],
			thread: [thread.id],
			threadComment: [releaseDenialComment.id, releaseRequestComment.id],
		});
	});
});
