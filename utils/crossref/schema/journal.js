import doiData from './doiData';

const getJournalInfo = (kind, citation, commuityTitle) => {
	if (kind === 'issue') {
		return citation !== '' ? citation : commuityTitle;
	}
	return commuityTitle;
};

export default ({
	title,
	citeAs,
	issn,
	language,
	children,
	doi,
	timestamp,
	url,
	contentVersion,
	kind,
}) => ({
	journal: {
		journal_metadata: {
			'@language': language,
			full_title: getJournalInfo(kind, citeAs, title),
			...(issn ? { '@media_type': 'electronic', '#text': issn } : {}),
			...doiData(doi, timestamp, url, contentVersion),
		},
		...children,
	},
});
