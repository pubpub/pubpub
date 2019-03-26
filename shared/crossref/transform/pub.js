import { pubComponentDoi, pubVersionComponentDoi } from '../components';
import transformAttributions from './attributions';

const resourceUrlGetter = (pubData, communityData) => (version) => {
	const communityHostname = communityData.domain || `${communityData.subdomain}.pubpub.org`;
	const baseUrl = `https://${communityHostname}/pub/${pubData.slug}`;
	if (version) {
		return `${baseUrl}?version={version.id}`;
	}
	return version;
};

const doiGetter = (pubData) => (version) => {
	if (version) {
		return pubVersionComponentDoi(pubData, version);
	}
	return pubComponentDoi(pubData);
};

export default ({ globals, community }) => (pub) => {
	const { timestamp } = globals;
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
		getDoi: doiGetter(pub),
	};
};
