import app from '../server';
import { Collection, CollectionPub, Pub, sequelize } from '../models';

import { withCommunityAdmin } from './permissions/communityAdmin';

app.post(
	'/api/collectionPubs',
	withCommunityAdmin((req, res) => {
		/* If the collection is being created from the pub, create the Collection first */
		const collectionPromise =
			!req.body.collectionId && req.body.title
				? Collection.create({
						kind: req.body.kind,
						title: req.body.title.trim(),
						isRestricted: true,
						isPublic: true,
						communityId: req.body.communityId,
				  })
				: Promise.resolve();
		return collectionPromise
			.then((newCollection) => {
				return CollectionPub.create({
					pubId: req.body.pubId,
					collectionId: req.body.collectionId || newCollection.id,
				});
			})
			.then((newCollectionPub) => {
				return CollectionPub.findOne({
					where: { id: newCollectionPub.id },
					include: [{ model: Collection, as: 'collection' }],
				});
			})
			.then((newCollectionPubData) => {
				return res.status(201).json(newCollectionPubData);
			})
			.catch((err) => {
				return res.status(500).json(err.message);
			});
	}),
);

app.delete(
	'/api/collectionPubs',
	withCommunityAdmin((req, res) => {
		return CollectionPub.destroy({
			where: { id: req.body.pubCollectionId },
		})
			.then(() => {
				return res.status(201).json(req.body.pubCollectionId);
			})
			.catch((err) => {
				return res.status(500).json(err.message);
			});
	}),
);

app.post(
	'/api/collectionPubs/bulk',
	withCommunityAdmin((req, res) => {
		const { communityId, collectionId, collectionPubs } = req.body;
		return Pub.findAll({ where: { communityId: communityId } }).then((addablePubs) => {
			const pubIds = collectionPubs.map((cp) => cp.pubId);
			const canAddAllPubs = pubIds.every((id) =>
				addablePubs.some((addablePub) => addablePub.id === id),
			);
			if (!canAddAllPubs) {
				return res.status(403).json('Cannot add all requested pubs to collection');
			}
			return sequelize
				.transaction((trx) =>
					Promise.all(
						[
							CollectionPub.destroy({
								transaction: trx,
								where: {
									collectionId: collectionId,
									pubId: { $notIn: pubIds },
								},
							}),
						].concat(
							collectionPubs.map(({ pubId, contextHint, id }, index) => {
								if (id) {
									return CollectionPub.update(
										{
											pubId: pubId,
											collectionId: collectionId,
											contextHint: contextHint,
											rank: index,
										},
										{ transaction: trx, returning: true, where: { id: id } },
									).then((result) => result[1][0]);
								}
								return CollectionPub.create(
									{
										pubId: pubId,
										collectionId: collectionId,
										contextHint: contextHint,
										rank: index,
										returning: true,
									},
									{ transaction: trx, returning: true },
								);
							}),
						),
					),
				)
				.then((results) => res.status(200).json(results.slice(1)));
		});
	}),
);

app.get(
	'/api/collectionPubs/bulk',
	withCommunityAdmin((req, res) => {
		const { communityId, collectionId } = req.query;
		return Collection.findOne({ where: { id: collectionId } }).then((collection) => {
			if (collection.communityId !== communityId) {
				return res.status(403).json('This collection does not belong to your community');
			}
			return CollectionPub.findAll({
				where: { collectionId: collectionId },
				order: [['rank', 'ASC']],
			}).then((collectionPubs) => res.status(200).json(collectionPubs));
		});
	}),
);
