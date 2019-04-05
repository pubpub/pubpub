/**
 * Helper functions for interacting with Collection models
 */
import { normalizeMetadataToKind } from 'shared/collections/metadata';
import { Community, Collection } from '../../models';
import withPermissions from '../permissions/withPermissions';

import { updateCollectionPubsForCollection } from './collectionPubs';

const createCollection = (title, kind, communityId) => {
	return Community.findOne({ where: { id: communityId } }).then((community) => {
		const collection = {
			title: title.trim(),
			isRestricted: true,
			isPublic: true,
			communityId: communityId,
			kind: kind,
		};
		const metadata = normalizeMetadataToKind({}, kind, {
			community: community,
			collection: collection,
		});
		return Collection.create({ ...collection, metadata: metadata }, { returning: true });
	});
};

const updateCollection = (collectionId, updateRequest) => {
	const updatedCollection = {};
	Object.keys(updateRequest).forEach((key) => {
		if (['title', 'isRestricted', 'isPublic', 'pageId', 'metadata'].indexOf(key) > -1) {
			updatedCollection[key] = updateRequest[key];
		}
	});
	return Collection.findOne({ where: { id: collectionId } }).then((collection) => {
		collection.update(updatedCollection).then((collectionAgain) => {
			const updateCollectionPubPromise =
				collection.isPublic && !collectionAgain.isPublic
					? updateCollectionPubsForCollection(collectionAgain.collectionId)
					: Promise.resolve();
			return updateCollectionPubPromise.then(() => collectionAgain);
		});
	});
};

const destroyCollection = (collectionId) =>
	updateCollectionPubsForCollection(collectionId, collectionId).then(() =>
		Collection.destroy({ where: { collectionId: collectionId } }),
	);

export default withPermissions({
	createCollection: createCollection,
	updateCollection: updateCollection,
	destroyCollection: destroyCollection,
});
