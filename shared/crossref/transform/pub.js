import transformAttributions from './attributions';

const resourceUrlGetter = (pub, community) => (version) => {
	const communityHostname = community.domain || `${community.subdomain}.pubpub.org`;
	const baseUrl = `https://${communityHostname}/pub/${pub.slug}`;
	if (version) {
		return `${baseUrl}?version=${version.id}`;
	}
	return baseUrl;
};

export default ({ globals, community }) => (pub) => {
	const { timestamp, getPubVersionDoi, pubDoi } = globals;
	const { title } = pub;
	const sortedVersions = pub.versions.sort((a, b) => a.createdAt - b.createdAt);
	const publicationDate = new Date(sortedVersions[0].createdAt);
	return {
		title: title,
		timestamp: timestamp,
		sortedVersions: sortedVersions,
		publicationDate: publicationDate,
		attributions: transformAttributions(pub.attributions),
		getResourceUrl: resourceUrlGetter(pub, community),
		doi: pubDoi,
		getVersionDoi: getPubVersionDoi,
	};
};
