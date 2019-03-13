import skeletonize, { maybe } from '../skeletonize';
import { getLanguageForCommunity } from './community';

import journalIssue from '../collection/journalIssue';
import journalArticle from '../pub/journalArticle';

const transformer = ({ community }) => {
	const { title, issn: denormalizedIssn } = community;
	const issn = denormalizedIssn && denormalizedIssn.replace('-', '');
	return { title: title, issn: issn, language: getLanguageForCommunity(community) };
};

const skeleton = (contentTuple, { title, issn, language }) => ({
	journal: {
		journal_metadata: {
			...maybe(
				issn && {
					'@media_type': 'electronic',
					'#text': issn,
				},
			),
			'@language': language,
			full_title: title,
			abbrev_title: title,
		},
		...journalIssue(contentTuple),
		...journalArticle(contentTuple),
	},
});

export default skeletonize(transformer, skeleton);
