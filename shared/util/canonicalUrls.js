/**
 * Utilities for providing canonical URLs for different entities
 */

export const communityUrl = (communityData) =>
	communityData && communityData.domain
		? `https://${communityData.domain}`
		: `https://${communityData.subdomain}.pubpub.org`;

export const collectionUrl = (communityData, collection) =>
	`${communityUrl(communityData)}/collection/${collection.id}`;
