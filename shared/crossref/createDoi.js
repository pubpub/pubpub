/**
 * Exports a handful of functions that provide a component DOI for various parts of the PubPub
 * information hierarchy: pubs, collections, communities.
 */
const PUBPUB_DOI_PREFIX = '10.21428';

const withPubPubDoiPrefix = (component) => `${PUBPUB_DOI_PREFIX}/${component}`;

const splitId = (item) => item.id.split('-')[0];

export const makeComponentId = (community, collection, pub) =>
	[community && splitId(community), collection && splitId(collection), pub && splitId(pub)]
		.map((result) => result || 'none')
		.join('-');

export default ({ community, collection, pub, version }) => {
	const communityPart = splitId(community);
	const collectionPart = collection ? `.${splitId(collection)}` : '';
	const pubPart = pub ? `.${splitId(pub)}` : '';
	const versionPart = version ? `/${splitId(version)}` : '';
	return withPubPubDoiPrefix(communityPart + collectionPart + pubPart + versionPart);
};
