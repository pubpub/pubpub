import doiData from './doiData';

const getJournalInfo = (flag, citation, commuityTitle) => {
	console.log(flag);
	if (flag) {
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
	issue,
}) => ({
	journal: {
		journal_metadata: {
			'@language': language,
			full_title: getJournalInfo(issue, citeAs, title),
			...(issn ? { '@media_type': 'electronic', '#text': issn } : {}),
			...doiData(doi, timestamp, url, contentVersion),
		},
		...children,
	},
});
