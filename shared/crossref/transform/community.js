import { communityComponentDoi } from '../components';

const getLanguageForCommunity = () => 'en';

export default ({ globals }) => (community) => {
	const { title, issn: denormalizedIssn } = community;
	const issn = denormalizedIssn && denormalizedIssn.replace('-', '');
	return {
		title: title,
		issn: issn,
		timestamp: globals.timestamp,
		language: getLanguageForCommunity(community),
		doi: communityComponentDoi(community),
	};
};
