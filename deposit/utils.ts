import { DefinitelyHas, Pub, PubEdge } from 'types';
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

export function preparePubForDeposit(
	pub: DefinitelyHas<Pub, 'inboundEdges' | 'outboundEdges'>,
	includeRelationships: boolean,
) {
	pub = structuredClone(pub);
	// Remove unapproved PubEdges for RelationTypes that require bidirectional
	// approval.
	console.log(pub.inboundEdges);
	filterForMutuallyApprovedEdges(pub.inboundEdges);
	filterForMutuallyApprovedEdges(pub.outboundEdges);

	// Find the primary relationship (in order of Preprint > Supplement > Review).
	const pubEdge = findParentEdgeByRelationTypes(pub, [
		RelationType.Preprint,
		RelationType.Supplement,
		RelationType.Review,
		RelationType.Rejoinder,
	]);

	if (!includeRelationships) {
		pub.inboundEdges = [];
		pub.outboundEdges = [];
	}

	return { pub, pubEdge };
}
