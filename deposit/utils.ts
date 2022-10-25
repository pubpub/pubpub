import { DefinitelyHas, Maybe, Pub, PubEdge } from 'types';
import { RelationType } from 'utils/pubEdge';
import { findParentEdgeByRelationTypes } from 'utils/pubEdge/relations';

function filterForMutuallyApprovedEdges(pubEdges: PubEdge[]) {
	let i = 0;
	while (i < pubEdges.length) {
		const { approvedByTarget, relationType } = pubEdges[i];
		if (
			(relationType === RelationType.Supplement || relationType === RelationType.Preprint) &&
			!approvedByTarget
		) {
			pubEdges.splice(i, 1);
		} else {
			i++;
		}
	}
}

export function preparePubForDeposit<
	T extends DefinitelyHas<Pub, 'inboundEdges' | 'outboundEdges'>,
>(pub: T, includeRelationships: boolean): { pub: T; pubEdge: Maybe<PubEdge> } {
	pub = structuredClone(pub);
	// Remove unapproved PubEdges for RelationTypes that require bidirectional
	// approval.
	filterForMutuallyApprovedEdges(pub.inboundEdges);
	filterForMutuallyApprovedEdges(pub.outboundEdges);

	// Find the primary relationship (in order of Preprint > Supplement > Review).
	const pubEdge = findParentEdgeByRelationTypes(pub, [
		RelationType.Preprint,
		RelationType.Supplement,
		RelationType.Review,
		RelationType.Rejoinder,
	]) as Maybe<PubEdge>;

	if (!includeRelationships) {
		pub.inboundEdges = [];
		pub.outboundEdges = [];
	}

	return { pub, pubEdge };
}
