/**
 * Utilities for providing canonical URLs for different entities
 */

// eslint-disable-next-line import/prefer-default-export
export const communityUrl = (communityData) =>
	communityData && communityData.domain
		? `https://${communityData.domain}`
		: `https://${communityData.subdomain}.pubpub.org`;

// STOPSHIP(ian): implement this route
export const collectionUrl = (communityData, collection) =>
	`${communityUrl(communityData)}/collection/${collection.id}`;
