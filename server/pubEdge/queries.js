import { PubEdge } from 'server/models';
import { createForeignPublication } from 'server/foreignPublication/queries';
import findRank from 'utils/findRank';

const findRankForNewPubEdge = async (pubId, moveToTop) => {
	const otherEdgesFromPub = await PubEdge.findAll({ where: { pubId: pubId } });
	const ranks = otherEdgesFromPub.map((edge) => edge.rank);
	return findRank(ranks, moveToTop ? 0 : ranks.length);
};

const getForeignPublicationId = async (maybeAttrs) => {
	if (maybeAttrs) {
		const foreignPublication = await createForeignPublication(maybeAttrs);
		return foreignPublication.id;
	}
	return null;
};

export const createPubEdge = async ({
	pubId,
	relationType,
	pubIsParent,
	foreignPublication = null,
	targetPubId = null,
	approvedByTarget = false,
	moveToTop = false,
}) => {
	const [foreignPublicationId, rank] = await Promise.all([
		getForeignPublicationId(foreignPublication),
		findRankForNewPubEdge(pubId, moveToTop),
	]);
	return PubEdge.create({
		pubId: pubId,
		rank: rank,
		relationType: relationType,
		pubIsParent: pubIsParent,
		targetPubId: targetPubId,
		approvedByTarget: approvedByTarget,
		foreignPublicationId: foreignPublicationId,
	});
};

export const updatePubEdge = async ({ pubEdgeId, ...update }) => {
	const edge = await PubEdge.findOne({ where: { id: pubEdgeId } });
	await edge.update(update);
	return edge;
};

export const destroyPubEdge = async (pubEdgeId) => {
	return PubEdge.destroy({ where: { id: pubEdgeId } });
};
