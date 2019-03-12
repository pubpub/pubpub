import app from '../server';
import { CollectionPub, Pub, Tag, sequelize } from '../models';

import withCommunityAdmin from './helpers/withCommunityAdmin';

app.post(
	'/api/collectionPubs',
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
	'/api/collectionPubs',
	withCommunityAdmin((req, res) => {
		const { communityId, collectionId } = req.query;
		return Tag.findOne({ where: { id: collectionId } }).then((tag) => {
			if (tag.communityId !== communityId) {
				return res.status(403).json('This collection does not belong to your community');
			}
			return CollectionPub.findAll({
				where: { collectionId: collectionId },
				order: [['rank', 'ASC']],
			}).then((collectionPubs) => res.status(200).json(collectionPubs));
		});
	}),
);
