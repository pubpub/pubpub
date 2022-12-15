import { fetchFacetsForScope } from 'server/facets';
import { Collection, CollectionAttribution, Community, DefinitelyHas } from 'types';
import { collectionUrl } from 'utils/canonicalUrls';
import { licenseDetailsByKind } from 'utils/licenses';
import { AnyResource, ResourceKind, ResourceContribution, ResourceContributorRole } from '../types';

const attributionRoleToResourceContributorRole: Record<string, ResourceContributorRole> = {
	'Writing – Review & Editing': 'Editor',
	Editor: 'Editor',
	'Series Editor': 'Editor',
	Translator: 'Translator',
	Chair: 'Editor',
};

function transformAttributionRoleToResourceContributorRole(role: string): ResourceContributorRole {
	return attributionRoleToResourceContributorRole[role] ?? 'Other';
}

function getResourceKindForCollection(collection: Collection): ResourceKind {
	switch (collection.kind) {
		case 'tag':
		case 'issue':
			return 'Journal';
		case 'book':
			return 'Book';
		case 'conference':
			return 'Conference';
	}
}

function transformCollectionAttributionToResourceContribution(
	attribution: CollectionAttribution,
	role: string,
): ResourceContribution {
	return {
		contributor: {
			name: attribution.name,
			orcid: attribution.orcid,
		},
		contributorAffiliation: attribution.affiliation,
		contributorRole: transformAttributionRoleToResourceContributorRole(role),
		isAttribution: Boolean(attribution.isAuthor),
	};
}

export async function transformCollectionToResource(
	collection: DefinitelyHas<Collection, 'attributions'>,
	community: Community,
): Promise<AnyResource> {
	let facets = await fetchFacetsForScope({ collectionId: collection.id }, ['License']);
	let licence = licenseDetailsByKind[facets.License.value.kind];
	let contributions: ResourceContribution[] = collection.attributions.flatMap(
		(attribution) =>
			attribution.roles?.map((role) =>
				transformCollectionAttributionToResourceContribution(attribution, role),
			) ?? [],
	);
	return {
		kind: getResourceKindForCollection(collection),
		title: collection.title,
		identifiers: [
			{
				identifierKind: 'url',
				identifierValue: collectionUrl(community, collection),
			},
		],
		timestamp: new Date().toUTCString(),
		license: { spdxIdentifier: licence.spdxIdentifier },
		contributions,
		relationships: [],
	};
}
