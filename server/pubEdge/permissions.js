import { getScope } from 'server/utils/queryHelpers';
import { PubEdge } from 'server/models';

export const canManagePubEdges = (scope) => scope.activePermissions.canManage;

export const canCreatePubEdge = async ({ pubId, userId }) => {
	const scope = await getScope({ pubId: pubId, loginId: userId });
	return canManagePubEdges(scope);
};

export const canUpdateOrDestroyPubEdge = async ({ pubEdgeId, userId }) => {
	const edge = await PubEdge.findOne({ where: { id: pubEdgeId } });
	const scope = await getScope({ pubId: edge.pubId, loginId: userId });
	return canManagePubEdges(scope);
};

export const canApprovePubEdgeWithTargetPubId = async ({ targetPubId, userId }) => {
	const scope = await getScope({ pubId: targetPubId, loginId: userId });
	return canManagePubEdges(scope);
};

export const canApprovePubEdge = async ({ pubEdgeId, userId }) => {
	const { targetPubId } = await PubEdge.findOne({ where: { id: pubEdgeId } });
	if (targetPubId) {
		return canApprovePubEdgeWithTargetPubId({ targetPubId: targetPubId, userId: userId });
	}
	return false;
};
