const getLanguageForCommunity = () => 'en';

export default (community) => {
	const { title, issn: denormalizedIssn } = community;
	const issn = denormalizedIssn && denormalizedIssn.replace('-', '');
	return { title: title, issn: issn, language: getLanguageForCommunity(community) };
};
