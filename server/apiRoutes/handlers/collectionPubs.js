import findRank from 'shared/util/findRank';
import { Collection, CollectionPub, sequelize } from '../../models';
import { getCollectionPubsInCollection } from '../../queryHelpers';
import withPermissions from '../permissions/withPermissions';

const CAN_UPDATE_ATTRIBUTES = ['rank', 'contextHint'];

const isPrimaryCandidate = (collection) => collection.kind !== 'tag' && collection.isPublic;

const createCollectionPub = (pubId, collectionId, rank) => {
	return Promise.all([
		Collection.findOne({ where: { id: collectionId } }),
		CollectionPub.findAll({
			where: { pubId: pubId },
			include: [{ model: Collection, as: 'collection' }],
		}),
		getCollectionPubsInCollection(collectionId),
	]).then(([collection, pubLevelPeers, collectionLevelPeers]) => {
		// If this is the first non-tag collection in the bunch, make it the primary one
		const isPrimary =
			pubLevelPeers.filter((peer) => peer.collection.kind !== 'tag').length === 0 &&
			collection.kind !== 'tag';
		// If a rank wasn't provided, move the CollectionPub to the end of the collection
		if (!rank) {
			const ranks = collectionLevelPeers.map((cp) => cp.rank).filter((r) => r);
			// eslint-disable-next-line no-param-reassign
			rank = findRank(ranks, ranks.length);
		}
		return CollectionPub.create(
			{ collectionId: collectionId, pubId: pubId, rank: rank, isPrimary: isPrimary },
			{ returning: true },
		);
	});
};

const normalizePrimaryCollectionPub = (pubId, excludeCandidateCollectionId) =>
	CollectionPub.findAll({
		where: { pubId: pubId },
		include: [{ model: Collection, as: 'collection' }],
	}).then((collectionPubs) => {
		const includableCollectionPubs = collectionPubs.filter(
			(cp) => cp.collection.id !== excludeCandidateCollectionId,
		);
		const primaries = includableCollectionPubs.filter((cp) => cp.isPrimary);
		const primaryCandidates = includableCollectionPubs.filter(({ collection }) =>
			isPrimaryCandidate(collection),
		);
		const nextPrimary = primaries[0] || primaryCandidates[0];
		const removePrimaryCriterion = nextPrimary ? { id: { $ne: nextPrimary.id } } : {};
		return Promise.all([
			nextPrimary && nextPrimary.save(),
			CollectionPub.update(
				{ isPrimary: false },
				{ where: { pubId: pubId, ...removePrimaryCriterion } },
			),
		]);
	});

export const updateCollectionPubsForCollection = (collectionId, excludeCandidateCollectionId) =>
	CollectionPub.findAll({ where: { collectionId: collectionId } }).then((collectionPubs) =>
		Promise.all(
			collectionPubs.map(
				(collectionPub) =>
					collectionPub.isPrimary &&
					normalizePrimaryCollectionPub(
						collectionPub.pubId,
						excludeCandidateCollectionId,
					),
			),
		),
	);

const updateCollectionPub = (id, updateRequest) => {
	const update = {};
	Object.keys(updateRequest).forEach((key) => {
		if (CAN_UPDATE_ATTRIBUTES.includes(key)) {
			update[key] = updateRequest[key];
		}
	});
	return CollectionPub.update(update, { where: { id: id }, returning: true });
};

const destroyCollectionPub = (id) =>
	CollectionPub.findOne({ where: { id: id } }).then((collectionPub) => {
		const { pubId } = collectionPub;
		collectionPub.destroy().then(() => normalizePrimaryCollectionPub(pubId));
	});

const setCollectionPubAsPrimary = (id) =>
	CollectionPub.findOne({
		where: { id: id },
		include: [{ model: Collection, as: 'collection' }],
	}).then(
		(collectionPub) =>
			collectionPub.collection.isPublic &&
			sequelize.transaction((txn) =>
				CollectionPub.update(
					{ isPrimary: false },
					{
						transaction: txn,
						where: { pubId: collectionPub.pubId, id: { $ne: id } },
					},
				).then(() =>
					CollectionPub.update(
						{ isPrimary: true },
						{ where: { id: id }, returning: true, transaction: txn },
					),
				),
			),
	);

export default withPermissions({
	createCollectionPub: createCollectionPub,
	updateCollectionPub: updateCollectionPub,
	destroyCollectionPub: destroyCollectionPub,
	setCollectionPubAsPrimary: setCollectionPubAsPrimary,
});
