import { Resource, ResourceKind } from '../types';
import { getPrimaryCollection } from 'utils/collections/primary';
import { Community, DefinitelyHas, Pub } from 'types';
import { preparePubForDeposit } from 'deposit/utils';
import { RelationType } from 'utils/pubEdge';
import { pubUrl } from 'utils/canonicalUrls';
import { fetchFacetsForScope } from 'server/facets';
import { licenseDetailsByKind } from 'utils/licenses';

function getResourceKindForPub(
	pub: DefinitelyHas<Pub, 'collectionPubs' | 'inboundEdges' | 'outboundEdges'>,
): ResourceKind {
	const prepared = preparePubForDeposit(pub, true);
	const collection = getPrimaryCollection(pub.collectionPubs);
	switch (prepared.parentPubEdge?.relationType) {
		case RelationType.Preprint:
		case RelationType.Supplement:
			return 'Other';
	}
	if (collection !== null) {
		switch (collection.kind) {
			case 'issue':
			case 'tag':
				return 'JournalArticle';
			case 'book':
				return 'BookChapter';
			case 'conference':
				return 'ConferenceProceeding';
		}
	}
	return 'JournalArticle';
}

export async function transformPubToResource(
	pub: DefinitelyHas<Pub, 'collectionPubs' | 'inboundEdges' | 'outboundEdges'>,
	community: Community,
): Promise<Resource> {
	let facets = await fetchFacetsForScope({ pubId: pub.id }, ['License']);
	let license = licenseDetailsByKind[facets.License.value.kind];
	return {
		kind: getResourceKindForPub(pub),
		title: pub.title,
		url: pubUrl(community, pub),
		timestamp: new Date().toUTCString(),
		license: {
			spdxIdentifier: license.spdxIdentifier,
		},
		contributions: [],
		relationships: [],
	};
}
