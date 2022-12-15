import { getPrimaryParentPubEdge, sanitizePubEdges } from 'deposit/utils';
import { fetchFacetsForScope } from 'server/facets';
import { Community, ExternalPublication, Pub, PubEdge } from 'types';
import { pubUrl } from 'utils/canonicalUrls';
import { getPrimaryCollection } from 'utils/collections/primary';
import { licenseDetailsByKind } from 'utils/licenses';
import { RelationType, relationTypeDefinitions } from 'utils/pubEdge';

import { AnyResource, ResourceKind, ResourceRelation, ResourceRelationship } from '../types';

const pubEdgeRelationTypeToResourceRelation: Record<
	keyof typeof relationTypeDefinitions,
	ResourceRelation
> = {
	comment: 'Comment',
	commentary: 'Comment',
	preprint: 'Preprint',
	rejoinder: 'Review',
	review: 'Review',
	reply: 'Reply',
	supplement: 'Supplement',
	translation: 'Translation',
	version: 'Version',
};

function derivePubResourceKind(pub: Pub): ResourceKind {
	const primaryParentPubEdge = getPrimaryParentPubEdge(pub);
	const primaryCollection = pub.collectionPubs ? getPrimaryCollection(pub.collectionPubs) : null;
	switch (primaryParentPubEdge?.relationType) {
		case RelationType.Preprint:
		case RelationType.Supplement:
			return 'Other';
		default:
			break;
	}
	if (primaryCollection !== null) {
		switch (primaryCollection.kind) {
			case 'issue':
			case 'tag':
				return 'JournalArticle';
			case 'book':
				return 'BookChapter';
			case 'conference':
				return 'ConferenceProceeding';
			default:
				throw new Error('Invalid primary collection kind');
		}
	}
	return 'JournalArticle';
}

function derivePubEdgeRelation(pubEdge: PubEdge): ResourceRelation {
	return pubEdgeRelationTypeToResourceRelation[pubEdge.relationType];
}

function transformExternalPublicationToResource({ title, url }: ExternalPublication): AnyResource {
	return {
		kind: 'Other',
		title,
		identifiers: [
			{
				identifierKind: 'url',
				identifierValue: url,
			},
		],
	};
}

async function transformOutboundEdgeToResourceRelationship(
	pubEdge: PubEdge,
	community: Community,
): Promise<ResourceRelationship> {
	return {
		isParent: pubEdge.pubIsParent,
		resource: pubEdge.externalPublication
			? transformExternalPublicationToResource(pubEdge.externalPublication)
			: await transformPubToResource(pubEdge.pub as Pub, community),
		relation: derivePubEdgeRelation(pubEdge),
	};
}

export async function transformPubToResource(pub: Pub, community: Community): Promise<AnyResource> {
	pub = sanitizePubEdges(pub, true);
	const facets = await fetchFacetsForScope({ pubId: pub.id }, ['License']);
	const license = licenseDetailsByKind[facets.License.value.kind];
	const relationships: ResourceRelationship[] = await Promise.all(
		(pub.outboundEdges ?? []).map((pubEdge) =>
			transformOutboundEdgeToResourceRelationship(pubEdge, community),
		),
	);
	const contributions = [];
	return {
		kind: derivePubResourceKind(pub),
		title: pub.title,
		timestamp: new Date().toUTCString(),
		license: { spdxIdentifier: license.spdxIdentifier },
		summaries: [],
		descriptions: [],
		contributions,
		relationships,
		identifiers: [
			{
				identifierKind: 'url',
				identifierValue: pubUrl(community, pub),
			},
		],
	};
}
