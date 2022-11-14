import { Resource, ResourceKind } from '../types';
import { Collection, Community } from 'types';
import { collectionUrl } from 'utils/canonicalUrls';
import { fetchFacetsForScope } from 'server/facets';
import { licenseDetailsByKind } from 'utils/licenses';

function getResourceKindForCollection(collection: Collection): ResourceKind {
	switch (collection.kind) {
		case 'tag':
		case 'issue':
			return ResourceKind.Journal;
		case 'book':
			return ResourceKind.Book;
		case 'conference':
			return ResourceKind.Conference;
	}
}

export async function transformCollectionToResource(
	collection: Collection,
	community: Community,
): Promise<Resource> {
	let facets = await fetchFacetsForScope({ collectionId: collection.id }, ['License']);
	let { spdx } = licenseDetailsByKind[facets.License.value.kind];
	return {
		kind: getResourceKindForCollection(collection),
		title: collection.title,
		url: collectionUrl(community, collection),
		timestamp: new Date().toUTCString(),
		license: {
			id: spdx,
		},
		contributions: [],
		relations: [],
	};
}
