/**
 * Exports a handful of functions that provide a component DOI for various parts of the PubPub
 * information hierarchy: pubs, collections, communities.
 */
const PUBPUB_DOI_ROOT = '10.21428';

const withRoot = (component) => `${PUBPUB_DOI_ROOT}/${component}`;

const splitId = (item) => item.id.split('-')[0];

export const pubComponentDoi = (pub) => withRoot(splitId(pub));

export const collectionComponentDoi = (collection) => withRoot(splitId(collection));

export const communityComponentDoi = (community) => withRoot(splitId(community));

export const makeComponentId = ({ community, collection, pub }) =>
	[community && splitId(community), collection && splitId(collection), pub && splitId(pub)]
		.map((result) => result || 'none')
		.join('-');
