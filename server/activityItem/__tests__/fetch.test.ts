/* global describe, it, expect, beforeEach, beforeAll, afterAll */
import { modelize, setup, teardown } from 'stubstub';

import { ActivityAssociations, ActivityAssociationType } from 'types';
import { ActivityItem } from 'server/models';

import { fetchActivityItems } from '../fetch';
import {
	createCollectionActivityItem,
	createCollectionPubActivityItem,
	createCollectionUpdatedActivityItem,
	createCommunityCreatedActivityItem,
	createCommunityUpdatedActivityItem,
	createPubActivityItem,
	createPubUpdatedActivityItem,
} from '../queries';

const models = modelize`
    User actor {}
    Community community {
        Collection collection {
            CollectionPub collectionPub {
                rank: "0"
                Pub pub {

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

	it('fetches items for pub-created, pub-updated, and pub-removed', async () => {
		const { community, pub, actor } = models;
		await createPubActivityItem('pub-created', actor.id, pub.id);
		await createPubUpdatedActivityItem(actor.id, pub.id, { ...pub, doi: 'some/old/doi' });
		await createPubActivityItem('pub-removed', actor.id, pub.id);
		const {
			activityItems: [removedItem, updatedItem, createdItem],
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
});
