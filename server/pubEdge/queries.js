import { Op } from 'sequelize';

import { RelatedPub, RelatedForeignObject } from 'server/models';

const getRelatedPubsForPub = (pubId, onlyApprovedRelations) => {
	return RelatedPub.findAll({
		where: {
			[Op.or]: [
				{
					childPubId: pubId,
					...(onlyApprovedRelations && { approvedByChild: true }),
				},
				{
					parentPubId: pubId,
					...(onlyApprovedRelations && { approvedByParent: true }),
				},
			],
		},
	});
};

const getRelatedForeignObjectsForPub = (pubId) => {
	return RelatedForeignObject.findAll({
		where: { pubId: pubId },
	});
};

export const getRelatedObjectsForPub = (pubId, onlyApprovedRelations = true) => {
	const [relatedPubs, relatedForeignObjects] = Promise.all([
		getRelatedPubsForPub(pubId, onlyApprovedRelations),
		getRelatedForeignObjectsForPub(pubId),
	]);
	return [...relatedPubs, ...relatedForeignObjects];
};
