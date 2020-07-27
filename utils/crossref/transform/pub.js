import { pubUrl } from 'utils/canonicalUrls';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { relationTypeDefinitions } from 'utils/pubEdge/relations';

import transformAttributions from './attributions';

function getIdentifierData(pubEdge, isInboundEdge) {
	const { externalPublication } = pubEdge;
	let targetPub = isInboundEdge ? pubEdge.pub : pubEdge.targetPub;

	let identifier;
	let identifierType;

	if (externalPublication) {
		if (externalPublication.doi) {
			identifier = externalPublication.doi;
			identifierType = 'doi';
		} else {
			identifier = externalPublication.url;
			identifierType = 'uri';
		}
	} else {
		if (targetPub.doi) {
			identifier = targetPub.doi;
			identifierType = 'doi';
		} else {
			identifier = pubUrl(targetPub.community, targetPub);
			identifierType = 'uri';
		}
	}

	return { identifier, identifierType };
}

function getEdgeCrossrefRelationship(pubEdge, isInboundEdge = false) {
	const { relationType, pubIsParent } = pubEdge;
	const { isIntraWork, crossrefRelationshipTypes } = relationTypeDefinitions[relationType];
	const crossrefRelationshipTypeIndex = +(isInboundEdge ? !pubIsParent : pubIsParent);
	const crossrefRelationshipType = crossrefRelationshipTypes[crossrefRelationshipTypeIndex];

	return {
		...getIdentifierData(pubEdge, isInboundEdge),
		isIntraWork,
		relationshipType: crossrefRelationshipType,
	};
}

export default ({ globals, community }) => (pub) => {
	const { timestamp, dois } = globals;
	const { title, inboundEdges, outboundEdges } = pub;
	const publicationDate = getPubPublishedDate(pub);
	const relatedItems = outboundEdges
		.map((pubEdge) => {
			return getEdgeCrossrefRelationship(pubEdge);
		})
		.concat(
			inboundEdges.map((pubEdge) => {
				return getEdgeCrossrefRelationship(pubEdge, true);
			}),
		);

	return {
		title: title,
		timestamp: timestamp,
		publicationDate: publicationDate,
		attributions: transformAttributions(pub.attributions),
		resourceUrl: pubUrl(community, pub),
		doi: dois.pub,
		relatedItems: relatedItems,
	};
};
