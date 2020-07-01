import { Pub, RelatedPub } from 'server/models';
import { getScope } from 'server/utils/queryHelpers';

export const canChangeRelatedPubsFromScope = (scope) => scope.activePermissions.canManage;

export const canCreateRelatedPub = async ({ parentPubId, childPubId, userId }) => {
	const scopes = await Promise.all(
		[parentPubId, childPubId].map(async (pubId) => {
			const pub = await Pub.findOne({ where: { id: pubId } });
			return getScope({ communityId: pub.communityId, pubId: pub.id, loginId: userId });
		}),
	);
	return scopes.some(canChangeRelatedPubsFromScope);
};

export const canDestroyRelatedPub = async ({ relatedPubId, userId }) => {
	const { creatingPub } = await RelatedPub.findOne({
		where: { id: relatedPubId },
		include: [{ model: Pub, as: 'creatingPub' }],
	});
	const pubScope = await getScope({
		communityId: creatingPub.communityId,
		pubId: creatingPub.id,
		loginId: userId,
	});
	return canChangeRelatedPubsFromScope(pubScope);
};
